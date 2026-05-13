import os
import json
import time
import re
from typing import List, Dict, Any, Optional, Tuple

import numpy as np
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ Load .env automatically
try:
    from dotenv import load_dotenv
    load_dotenv()
except Exception:
    pass

# Gemini SDK (legacy)
import google.generativeai as genai

# Optional PDF support
try:
    from PyPDF2 import PdfReader
except Exception:
    PdfReader = None


# -----------------------------
# App + CORS
# -----------------------------
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # Dev mode
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# -----------------------------
# Config + Paths
# -----------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
KB_DIR = os.path.join(BASE_DIR, "knowledge_base")
STORE_DIR = os.path.join(BASE_DIR, "rag_store")
CHUNKS_PATH = os.path.join(STORE_DIR, "chunks.json")
EMB_PATH = os.path.join(STORE_DIR, "embeddings.npy")

# Gemini models
EMBED_MODEL = os.getenv("EMBED_MODEL", "text-embedding-004")
GEN_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

TOP_K = int(os.getenv("RAG_TOP_K", "4"))
MIN_SIM = float(os.getenv("RAG_MIN_SIM", "0.20"))
MAX_WORDS = int(os.getenv("RAG_MAX_WORDS", "140"))

# Gemini key
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "").strip()
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)


# -----------------------------
# Request model
# -----------------------------
class Query(BaseModel):
    question: str


# -----------------------------
# In-memory index
# -----------------------------
_chunks: List[Dict[str, Any]] = []
_embs: Optional[np.ndarray] = None

# Parsed KB cache (for docs-first answers even when no Gemini key)
_kb_cache: Dict[str, Any] = {
    "symptoms": [],   # list[str]
    "red_flags": [],  # list[str]
    "workflow": []    # list[str]
}


# -----------------------------
# Guardrails: no meds/dosage
# -----------------------------
MEDICATION_PATTERNS = [
    r"\bmg\b", r"\bml\b", r"\btablet(s)?\b", r"\bcapsule(s)?\b",
    r"\bdos(e|age)\b", r"\bprescrib(e|ed|ing)\b", r"\bantibiotic(s)?\b",
    r"\bsteroid(s)?\b", r"\binjection(s)?\b"
]

COMMON_DRUG_WORDS = [
    "amoxicillin", "metronidazole", "prednisone", "ivermectin",
    "paracetamol", "acetaminophen", "ibuprofen", "aspirin"
]

def contains_medication_content(text: str) -> bool:
    lower = (text or "").lower()
    if any(re.search(p, lower) for p in MEDICATION_PATTERNS):
        return True
    if any(w in lower for w in COMMON_DRUG_WORDS):
        return True
    return False


# -----------------------------
# Intent + Medical detection
# -----------------------------
GREET_WORDS = {"hi", "hello", "hey", "hii", "hyyy"}
THANK_WORDS = {"thanks", "thank you", "thx", "ty"}

APPT_WORDS = {"appointment", "book", "booking", "schedule"}
VISIT_WORDS = {"visit", "visits", "history", "record", "records"}
SUPPORT_WORDS = {"support", "contact", "help"}

MEDICAL_KEYWORDS = [
    "vomit", "vomiting", "diarrhea", "loose motion", "fever", "cough",
    "sneeze", "breathing", "panting", "blood", "bleeding", "wound",
    "injury", "pain", "limp", "limping", "not eating", "no appetite",
    "appetite", "dehydration", "weak", "lethargy", "seizure", "itch",
    "rash", "swelling", "infection", "tick", "fleas", "urine", "pee",
    "poop", "stool", "constipation", "dental", "gum"
]

def looks_medical(question: str) -> bool:
    q = (question or "").lower()
    return any(k in q for k in MEDICAL_KEYWORDS)

def extract_name(text: str) -> Optional[str]:
    t = (text or "").strip()
    lower = t.lower()

    if "my name is" in lower:
        name = t.split("my name is", 1)[-1].strip()
        return " ".join(w.capitalize() for w in name.split()) if name else None

    for prefix in ["i'm", "i am"]:
        if prefix in lower:
            name = t.split(prefix, 1)[-1].strip()
            if name and len(name.split()) <= 3:
                return " ".join(w.capitalize() for w in name.split())
    return None


# -----------------------------
# Answer sanitation
# - Booking nudge ONLY when medical
# -----------------------------
def sanitize_answer(text: str, max_words: int = 140, is_medical: bool = False) -> str:
    if not text:
        text = "I couldn’t generate a response."

    lower = text.lower()

    # Hard block medication/dosage content
    if contains_medication_content(lower):
        safe = (
            "I can share general guidance, but I can’t recommend medicines or dosages.\n"
            "1) What this could indicate: digestive upset, diet change, infection, stress, or irritation.\n"
            "2) What to watch next:\n"
            "• repeated vomiting/diarrhea\n"
            "• weakness, blood in vomit/stool, breathing trouble\n"
            "• refusal to eat/drink, dehydration signs\n"
            "3) Recommendation: Please book a vet appointment—urgent if severe signs appear."
        )
        return safe

    # Enforce word limit
    words = text.split()
    if len(words) > max_words:
        text = " ".join(words[:max_words]).rstrip() + "…"

    # Ensure booking nudge exists ONLY for medical answers
    if is_medical:
        if "appointment" not in lower and "book" not in lower:
            text = text.strip() + "\n\n3) Recommendation: Please book an appointment in the Appointments & Visits section."

    return text.strip()


# -----------------------------
# Helpers: folders + doc loading
# -----------------------------
def ensure_store():
    os.makedirs(STORE_DIR, exist_ok=True)

def ensure_kb():
    os.makedirs(KB_DIR, exist_ok=True)

def _read_text_file(path: str) -> str:
    with open(path, "r", encoding="utf-8", errors="ignore") as f:
        return f.read()

def _read_pdf_file(path: str) -> str:
    if PdfReader is None:
        return ""
    try:
        reader = PdfReader(path)
        pages = []
        for p in reader.pages:
            pages.append(p.extract_text() or "")
        return "\n".join(pages)
    except Exception:
        return ""

def load_documents(kb_dir: str) -> List[Dict[str, str]]:
    docs = []
    if not os.path.isdir(kb_dir):
        return docs

    for name in os.listdir(kb_dir):
        path = os.path.join(kb_dir, name)
        if not os.path.isfile(path):
            continue

        ext = os.path.splitext(name)[1].lower()
        text = ""
        if ext in [".txt", ".md"]:
            text = _read_text_file(path)
        elif ext == ".pdf":
            text = _read_pdf_file(path)

        text = (text or "").strip()
        if text:
            docs.append({"source": name, "text": text})
    return docs


# -----------------------------
# Chunking
# -----------------------------
def chunk_text(text: str, source: str, chunk_size: int = 900, overlap: int = 140) -> List[Dict[str, Any]]:
    text = " ".join(text.split())
    chunks = []
    start = 0
    idx = 0

    while start < len(text):
        end = min(len(text), start + chunk_size)
        chunk = text[start:end].strip()
        if chunk:
            chunks.append({"id": f"{source}::chunk_{idx}", "source": source, "text": chunk})
            idx += 1
        start = end - overlap
        if start < 0:
            start = 0
        if end == len(text):
            break

    return chunks


# -----------------------------
# KB parsing (NEW)
# Extract bullets from your markdown for docs-first answers
# -----------------------------
def parse_kb_text(all_text: str) -> Dict[str, List[str]]:
    """
    Extracts bullet lists under headings:
    - Common Symptoms
    - Red Flags
    - Clinic Workflow
    """
    lines = [l.strip() for l in (all_text or "").splitlines()]
    section = None
    out = {"symptoms": [], "red_flags": [], "workflow": []}

    def push_bullet(dst_key: str, line: str):
        line = re.sub(r"^[-•]\s*", "", line).strip()
        if line:
            out[dst_key].append(line)

    for line in lines:
        low = line.lower()

        if low.startswith("## common symptoms"):
            section = "symptoms"
            continue
        if low.startswith("## red flags"):
            section = "red_flags"
            continue
        if low.startswith("## clinic workflow"):
            section = "workflow"
            continue
        if low.startswith("#") and not low.startswith("##"):
            section = None
            continue

        if section and (line.startswith("- ") or line.startswith("• ")):
            push_bullet(section, line)

    return out

def refresh_kb_cache():
    global _kb_cache
    # Merge all docs text for parsing
    combined = "\n\n".join([c["text"] for c in _chunks]) if _chunks else ""
    _kb_cache = parse_kb_text(combined)


# -----------------------------
# Embeddings + similarity
# -----------------------------
def embed_texts(texts: List[str], task_type: str) -> np.ndarray:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set.")

    vectors = []
    for t in texts:
        resp = genai.embed_content(
            model=EMBED_MODEL,
            content=t,
            task_type=task_type,
        )
        vec = np.array(resp["embedding"], dtype=np.float32)
        vectors.append(vec)
        time.sleep(0.05)

    return np.vstack(vectors)

def cosine_sim_matrix(query_vec: np.ndarray, doc_vecs: np.ndarray) -> np.ndarray:
    q = query_vec / (np.linalg.norm(query_vec) + 1e-8)
    d = doc_vecs / (np.linalg.norm(doc_vecs, axis=1, keepdims=True) + 1e-8)
    return np.dot(d, q)


# -----------------------------
# Index build/load
# -----------------------------
def save_chunks_only(chunks: List[Dict[str, Any]]):
    ensure_store()
    with open(CHUNKS_PATH, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)

def save_index(chunks: List[Dict[str, Any]], embs: np.ndarray):
    ensure_store()
    with open(CHUNKS_PATH, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)
    np.save(EMB_PATH, embs)

def load_index() -> bool:
    global _chunks, _embs
    loaded_any = False

    if os.path.exists(CHUNKS_PATH):
        with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
            _chunks = json.load(f)
        loaded_any = True

    if os.path.exists(EMB_PATH):
        _embs = np.load(EMB_PATH).astype(np.float32)
        loaded_any = True
    else:
        _embs = None

    return loaded_any

def build_index():
    """
    Builds vector index from knowledge_base.
    ALWAYS saves chunks.json even if embeddings can't be built.
    """
    global _chunks, _embs

    ensure_kb()
    docs = load_documents(KB_DIR)

    all_chunks = []
    for d in docs:
        all_chunks.extend(chunk_text(d["text"], d["source"]))

    _chunks = all_chunks

    # ✅ Always save chunks so docs can be used in "basic mode"
    save_chunks_only(_chunks)

    refresh_kb_cache()

    # If no docs, stop
    if not _chunks:
        _embs = None
        return

    # If no key, skip embeddings
    if not GEMINI_API_KEY:
        _embs = None
        return

    try:
        texts = [c["text"] for c in _chunks]
        _embs = embed_texts(texts, task_type="retrieval_document")
        save_index(_chunks, _embs)
    except Exception:
        _embs = None


# -----------------------------
# Retrieval: semantic if possible, else STRONG lexical fallback (UPGRADED)
# -----------------------------
STOPWORDS = {
    "my","is","am","are","the","a","an","to","and","or","of","in","on","for","with","please"
}

def retrieve_context(question: str) -> List[Dict[str, Any]]:
    q = (question or "").strip().lower()
    if not q or not _chunks:
        return []

    # 1) semantic retrieval if embeddings exist
    if _embs is not None and GEMINI_API_KEY:
        try:
            q_vec = embed_texts([q], task_type="retrieval_query")[0]
            sims = cosine_sim_matrix(q_vec, _embs)
            top_idx = np.argsort(-sims)[:TOP_K]
            results = []
            for i in top_idx:
                score = float(sims[i])
                if score < MIN_SIM:
                    continue
                results.append({"score": score, "source": _chunks[i]["source"], "text": _chunks[i]["text"]})
            if results:
                return results
        except Exception:
            pass

    # 2) lexical fallback (works without key)
    q_words = [w for w in re.findall(r"[a-zA-Z]+", q) if w not in STOPWORDS]
    if not q_words:
        q_words = re.findall(r"[a-zA-Z]+", q)

    q_phrase = " ".join(q_words)
    scored: List[Tuple[int, Dict[str, Any]]] = []

    for c in _chunks:
        text = c["text"].lower()
        score = 0

        # phrase boost
        if q_phrase and q_phrase in text:
            score += 6

        # keyword boost
        for w in q_words:
            if w in text:
                score += 2

        # symptom phrase boosts
        if "not eating" in q and "not eating" in text:
            score += 8
        if "vomit" in q and ("vomit" in text or "vomiting" in text):
            score += 8
        if "diarr" in q and "diarr" in text:
            score += 8
        if "letharg" in q and "letharg" in text:
            score += 8

        if score > 0:
            scored.append((score, c))

    scored.sort(key=lambda x: x[0], reverse=True)

    results = []
    for score, c in scored[:TOP_K]:
        results.append({"score": float(score), "source": c["source"], "text": c["text"]})
    return results


# -----------------------------
# Docs-based answer (UPGRADED to use your KB bullets)
# Works EVEN if contexts empty (uses _kb_cache)
# -----------------------------
def pick_symptom_line(q: str) -> str:
    ql = q.lower()
    symptoms = _kb_cache.get("symptoms", [])

    # prioritize matching symptom lines
    if "not eating" in ql or "no appetite" in ql or "appetite" in ql:
        for s in symptoms:
            if "not eating" in s.lower():
                return s
        return "Not eating can happen due to stress, pain, dental issues, digestive upset, or illness."

    if "vomit" in ql or "vomiting" in ql or "diarr" in ql:
        for s in symptoms:
            if "vomiting" in s.lower() or "diarrhea" in s.lower():
                return s
        return "Vomiting/diarrhea can be caused by diet changes, infections, stress, or irritation."

    if "letharg" in ql:
        for s in symptoms:
            if "lethargy" in s.lower():
                return s
        return "Lethargy can signal many conditions; consider vet evaluation if persistent."

    # generic fallback
    if symptoms:
        return symptoms[0]
    return "Symptoms can have multiple causes; monitoring and vet evaluation is recommended if persistent."

def pick_red_flags(max_flags: int = 3) -> List[str]:
    flags = _kb_cache.get("red_flags", [])
    if flags:
        return flags[:max_flags]
    return [
        "trouble breathing, collapse, seizures",
        "repeated vomiting/diarrhea with weakness",
        "blood in vomit or stool"
    ][:max_flags]

def pick_workflow_line() -> str:
    wf = _kb_cache.get("workflow", [])
    for w in wf:
        if "booking" in w.lower() or "appointment" in w.lower():
            return w
    return 'Booking an appointment: Use the "Appointments & Visits" section in the app.'

def answer_from_docs(question: str, contexts: List[Dict[str, Any]], is_medical: bool) -> str:
    # If KB cache empty but contexts exist, refresh cache from contexts
    if (not _kb_cache.get("symptoms")) and contexts:
        combined = "\n\n".join([c["text"] for c in contexts])
        parsed = parse_kb_text(combined)
        if parsed["symptoms"] or parsed["red_flags"] or parsed["workflow"]:
            _kb_cache["symptoms"] = parsed["symptoms"]
            _kb_cache["red_flags"] = parsed["red_flags"]
            _kb_cache["workflow"] = parsed["workflow"]

    if is_medical:
        what = pick_symptom_line(question)
        flags = pick_red_flags(3)

        return (
            f"1) What this could indicate: {what}\n"
            "2) What to watch next:\n"
            f"• {flags[0]}\n"
            f"• {flags[1]}\n"
            f"• {flags[2]}\n"
            "3) Recommendation: Please book an appointment in the Appointments & Visits section."
        )

    # Non-medical: workflow guidance from KB
    return (
        "Here’s how to proceed in the app:\n"
        f"• {pick_workflow_line()}\n"
        "• If symptoms are severe: book urgently or seek immediate vet care.\n"
        "• Bring details: symptom start time, frequency, appetite/water intake, and any recent food changes."
    )


# -----------------------------
# Generation: docs-first ALWAYS if key missing, Gemini optional
# -----------------------------
def generate_answer(question: str, contexts: List[Dict[str, Any]], is_medical: bool) -> str:
    # ✅ If no key, ALWAYS answer using KB docs (no stupid fallback)
    if not GEMINI_API_KEY:
        return answer_from_docs(question, contexts, is_medical=is_medical)

    # Gemini path
    context_block = ""
    if contexts:
        context_block = "\n\n".join([f"[Source: {c['source']}]\n{c['text']}" for c in contexts])

    if is_medical:
        system_style = (
            "You are PawCare Assistant, a safety-first pet healthcare triage assistant (not a veterinarian).\n"
            "Rules:\n"
            "- Do NOT prescribe medicines, dosages, brand names, or treatment plans.\n"
            "- Do NOT provide step-by-step medical procedures.\n"
            "- Do NOT claim a diagnosis. Offer general possibilities only.\n"
            "- Encourage booking an appointment for persistent or concerning symptoms.\n"
            "- If severe symptoms: advise urgent vet care immediately.\n"
            "Output format (strict):\n"
            "1) What this could indicate (1-2 lines)\n"
            "2) What to watch next (2-4 bullets)\n"
            "3) Recommendation (1 line: book appointment)\n"
            f"Keep the whole answer under {MAX_WORDS} words."
        )

        prompt = f"""{system_style}

USER QUESTION:
{question}

CONTEXT (may be empty):
{context_block}

Now answer following the exact output format.
"""
    else:
        system_style = (
            "You are PawCare Assistant for a Pet Clinic platform.\n"
            "Be friendly, concise, and helpful.\n"
            "If the user greets or introduces themselves, respond naturally.\n"
            "If the user asks about app actions (appointments/visits/support), guide them.\n"
            "Do NOT prescribe medicines or dosages.\n"
            f"Keep responses under {MAX_WORDS} words."
        )

        prompt = f"""{system_style}

USER MESSAGE:
{question}

CONTEXT (may be empty):
{context_block}

Reply naturally (no forced 1/2/3 format).
"""

    try:
        model = genai.GenerativeModel(GEN_MODEL)
        resp = model.generate_content(prompt)
        return (resp.text or "").strip()
    except Exception:
        # If Gemini fails, fall back to docs (still good)
        return answer_from_docs(question, contexts, is_medical=is_medical)


# -----------------------------
# Startup
# -----------------------------
@app.on_event("startup")
def startup_event():
    if not load_index():
        build_index()
    else:
        refresh_kb_cache()


# -----------------------------
# Routes
# -----------------------------
@app.get("/")
def root():
    return {"message": "PetClinic Chatbot API is running", "model": GEN_MODEL, "rag_ready": bool(GEMINI_API_KEY)}

@app.post("/chat")
def chat(query: Query):
    question = (query.question or "").strip()
    if not question:
        return {"response": "Please enter a question."}

    lower = question.lower().strip()
    is_medical = looks_medical(question)

    # ✅ friendly conversation intents (no triage)
    if any(w in lower for w in GREET_WORDS) and not is_medical:
        return {"response": "Hi there! 🐾 How can I help you today?"}

    if any(w in lower for w in THANK_WORDS) and not is_medical:
        return {"response": "You’re welcome! 🐾 How can I help next?"}

    name = extract_name(question)
    if name and not is_medical:
        return {"response": f"Nice to meet you, {name}! 🐾 How can I help with your pet today?"}

    # ✅ app navigation intents
    if not is_medical:
        if any(w in lower for w in APPT_WORDS):
            return {"response": "Sure — you can book or view appointments in the Appointments section."}
        if any(w in lower for w in VISIT_WORDS):
            return {"response": "You can view visit history in the Visits section."}
        if any(w in lower for w in SUPPORT_WORDS):
            return {"response": "You can reach support via the Contact page. Tap “Talk to Support” to open it."}

    # ✅ RAG retrieval
    contexts = retrieve_context(question)

    # ✅ Generate answer
    answer = generate_answer(question, contexts, is_medical=is_medical)
    answer = sanitize_answer(answer, max_words=MAX_WORDS, is_medical=is_medical)

    return {"response": answer}

@app.post("/reindex")
def reindex():
    build_index()
    return {"message": "Reindex complete", "chunks": len(_chunks)}