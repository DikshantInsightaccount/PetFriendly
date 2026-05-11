import os
import json
import time
import re
from typing import List, Dict, Any, Optional

import numpy as np
from pydantic import BaseModel
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# ✅ Load .env automatically (IMPORTANT)
try:
    from dotenv import load_dotenv
    load_dotenv()  # loads chatbot-backend/.env into process env
except Exception:
    pass

# Gemini SDK (deprecated warning is OK for now)
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
EMBED_MODEL = "text-embedding-004"
GEN_MODEL = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

TOP_K = int(os.getenv("RAG_TOP_K", "4"))
MIN_SIM = float(os.getenv("RAG_MIN_SIM", "0.20"))
MAX_WORDS = int(os.getenv("RAG_MAX_WORDS", "120"))

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

def sanitize_answer(text: str, max_words: int = 120) -> str:
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

    # Ensure booking nudge exists
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
# Embeddings + similarity
# -----------------------------
def embed_texts(texts: List[str], task_type: str) -> np.ndarray:
    if not GEMINI_API_KEY:
        raise RuntimeError("GEMINI_API_KEY is not set. Put it in chatbot-backend/.env and restart.")

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
def save_index(chunks: List[Dict[str, Any]], embs: np.ndarray):
    ensure_store()
    with open(CHUNKS_PATH, "w", encoding="utf-8") as f:
        json.dump(chunks, f, ensure_ascii=False, indent=2)
    np.save(EMB_PATH, embs)

def load_index() -> bool:
    global _chunks, _embs
    if os.path.exists(CHUNKS_PATH) and os.path.exists(EMB_PATH):
        with open(CHUNKS_PATH, "r", encoding="utf-8") as f:
            _chunks = json.load(f)
        _embs = np.load(EMB_PATH).astype(np.float32)
        return True
    return False

def build_index():
    """
    Builds vector index from knowledge_base.
    Filters out unsafe chunks containing meds/dosages.
    """
    global _chunks, _embs

    ensure_kb()
    docs = load_documents(KB_DIR)

    all_chunks = []
    for d in docs:
        all_chunks.extend(chunk_text(d["text"], d["source"]))

    safe_chunks = [c for c in all_chunks if not contains_medication_content(c["text"])]

    _chunks = safe_chunks

    # If no docs or no safe chunks, don't crash — allow LLM-only fallback
    if not safe_chunks or not GEMINI_API_KEY:
        _embs = None
        return

    texts = [c["text"] for c in safe_chunks]
    _embs = embed_texts(texts, task_type="retrieval_document")
    save_index(_chunks, _embs)


# -----------------------------
# RAG retrieve + generate (triage-only)
# -----------------------------
def retrieve_context(question: str) -> List[Dict[str, Any]]:
    if _embs is None or not _chunks or not GEMINI_API_KEY:
        return []

    q_vec = embed_texts([question], task_type="retrieval_query")[0]
    sims = cosine_sim_matrix(q_vec, _embs)

    top_idx = np.argsort(-sims)[:TOP_K]
    results = []
    for i in top_idx:
        score = float(sims[i])
        if score < MIN_SIM:
            continue
        results.append({"score": score, "source": _chunks[i]["source"], "text": _chunks[i]["text"]})
    return results

def generate_answer(question: str, contexts: List[Dict[str, Any]]) -> str:
    if not GEMINI_API_KEY:
        return (
            "1) What this could indicate: I’m not configured with AI right now.\n"
            "2) What to watch next:\n"
            "• if symptoms persist or worsen\n"
            "• any red flags (blood, breathing trouble, severe weakness)\n"
            "3) Recommendation: Please book an appointment in the Appointments & Visits section."
        )

    system_style = (
        "You are PetClinic AI Support (triage assistant), not a veterinarian.\n"
        "Goal: provide limited, safety-first guidance and encourage booking an appointment.\n"
        "Rules:\n"
        "- Do NOT prescribe medications, dosages, brand names, or treatment plans.\n"
        "- Do NOT provide step-by-step medical procedures.\n"
        "- Do NOT claim diagnosis. Offer general possibilities only.\n"
        "- Always recommend booking an appointment for persistent or concerning symptoms.\n"
        "- If severe symptoms: advise urgent vet care immediately.\n"
        "Output format (always):\n"
        "1) What this could indicate (1-2 lines)\n"
        "2) What to watch next (2-3 bullets)\n"
        "3) Recommendation (1 line: book appointment)\n"
        f"Keep the whole answer under {MAX_WORDS} words."
    )

    context_block = ""
    if contexts:
        context_block = "\n\n".join([f"[Source: {c['source']}]\n{c['text']}" for c in contexts])

    prompt = f"""{system_style}

USER QUESTION:
{question}

CONTEXT (may be empty):
{context_block}

Now answer following the exact output format.
"""

    model = genai.GenerativeModel(GEN_MODEL)
    resp = model.generate_content(prompt)
    return (resp.text or "").strip()


# -----------------------------
# Startup
# -----------------------------
@app.on_event("startup")
def startup_event():
    # Try load existing index; if not present, build.
    # Will not crash even if key is missing.
    if not load_index():
        build_index()


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
        return {"response": "Please enter a question.\n\n3) Recommendation: Please book an appointment in the Appointments & Visits section."}

    contexts = retrieve_context(question)
    answer = generate_answer(question, contexts)
    answer = sanitize_answer(answer, max_words=MAX_WORDS)

    return {"response": answer}

@app.post("/reindex")
def reindex():
    build_index()
    return {"message": "Reindex complete", "chunks": len(_chunks)}