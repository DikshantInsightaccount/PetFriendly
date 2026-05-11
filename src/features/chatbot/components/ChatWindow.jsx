import { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { scrollToBottom } from "../../../utils/chatScroll";
import styles from "./ChatWindow.module.css";
import { motion } from "framer-motion";
import { sendChatMessage } from "../chatbotApi";
import { useNavigate } from "react-router-dom";

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      role: "bot",
      text: "Hi! I’m PawCare Assistant 🐾 How can I help you today?",
      timestamp: Date.now(),
    },
  ]);
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  // ✅ Auto scroll
  useEffect(() => {
    scrollToBottom(bottomRef);
  }, [messages, loading]);

  // ✅ Send message (CONNECTED TO BACKEND)
const sendMessage = async (text) => {
  if (!text.trim()) return;

  // ✅ Add user message instantly
  const userMsg = {
    id: crypto.randomUUID(),
    role: "user",
    text,
    timestamp: Date.now(),
  };

  setMessages((prev) => [...prev, userMsg]);
  setLoading(true);

  const lower = text.toLowerCase();

  try {
    // ✅ CALL BACKEND
    const reply = await sendChatMessage(text);

    const botMsg = {
      id: crypto.randomUUID(),
      role: "bot",
      text: reply,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, botMsg]);

    // ✅ ✅ NAVIGATION LOGIC (SMART UX)
    if (lower.includes("book appointment") || lower.includes("booking")) {
      setTimeout(() => {
        navigate("/appointments");
      }, 800);
    }

    if (lower.includes("view appointments")) {
      setTimeout(() => {
        navigate("/appointments");
      }, 800);
    }

    if (lower.includes("visit") || lower.includes("history")) {
      setTimeout(() => {
        navigate("/visits");
      }, 800);
    }

    if (lower.includes("support")) {
      setTimeout(() => {
        navigate("/support");
      }, 800);
    }

  } catch (err) {
    setMessages((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        role: "bot",
        text: "⚠️ Unable to reach the server. Please try again.",
        timestamp: Date.now(),
        error: true,
      },
    ]);
  }

  setLoading(false);
};


  return (
    <div className={styles.container}>
      
      {/* ✅ Header */}
      <div className={styles.header}>
        <div className={styles.title}>
          🐾 PawCare Assistant
          <span className={styles.status}>
            {loading ? "Typing..." : "Online"}
          </span>
        </div>

        <div className={styles.actions}>
          <button aria-label="Minimize">—</button>
          <button onClick={onClose} aria-label="Close chat">✕</button>
        </div>
      </div>

      {/* ✅ Messages */}
      <div className={styles.messages}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.18 }}
          >
            <MessageBubble message={msg} />
          </motion.div>
        ))}

        {/* ✅ Typing indicator */}
        {loading && <MessageBubble role="bot" loading />}

        <div ref={bottomRef} />
      </div>

      {/* ✅ Quick Actions */}
      <div className={styles.quickActions}>
        {[
          "Book Appointment",
          "View Appointments",
          "View Visits",
          "Talk to Support",
        ].map((q) => (
          <button key={q} onClick={() => sendMessage(q)}>
            {q}
          </button>
        ))}
      </div>

      {/* ✅ Input */}
      <ChatInput onSend={sendMessage} disabled={loading} />
    </div>
  );
}