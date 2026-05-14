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

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    scrollToBottom(bottomRef);
  }, [messages, loading]);

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

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
      const reply = await sendChatMessage(text);

      const botMsg = {
        id: crypto.randomUUID(),
        role: "bot",
        text: reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMsg]);

      if (lower.includes("book appointment") || lower.includes("booking")) {
        setTimeout(() => navigate("/app/book-appointment"), 800);
      }
      if (lower.includes("view appointments")) {
        setTimeout(() => navigate("/appointments"), 800);
      }
      if (lower.includes("visit") || lower.includes("history")) {
        setTimeout(() => navigate("/visits"), 800);
      }
      if (lower.includes("support")) {
        setTimeout(() => navigate("/contact"), 800);
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
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.headerAvatar} aria-hidden="true">🐾</div>
          <div className={styles.headerText}>
            <div className={styles.titleRow}>
              <div className={styles.title}>PawCare Assistant</div>
              <span className={styles.sparkle} aria-hidden="true">✦</span>
            </div>

            <div className={styles.subRow} aria-live="polite">
              <span className={styles.statusDot} aria-hidden="true" />
              <span className={styles.statusText}>
                {loading ? "Thinking…" : "Online"}
              </span>
              {/* <span className={styles.subHint}>
                {loading ? "Generating a helpful reply" : "Typically replies instantly"}
              </span> */}
            </div>
          </div>
        </div>

        <button onClick={onClose} className={styles.closeBtn} aria-label="Close chat">
          ✕
        </button>
      </div>

      {/* Messages */}
      <div className={styles.messages}>
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <MessageBubble message={msg} />
          </motion.div>
        ))}

        {loading && <MessageBubble role="bot" loading />}

        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div className={styles.quickActions}>
        {[
          { label: "Book Appointment", icon: "📅" },
          { label: "View Appointments", icon: "🗓️" },
          { label: "Emergency Help", icon: "🚑" },
          { label: "Pet Care Tips", icon: "💡" },
          { label: "Contact Vet", icon: "💬" },
        ].map((q) => (
          <button key={q.label} onClick={() => sendMessage(q.label)}>
            <span className={styles.actionIcon} aria-hidden="true">{q.icon}</span>
            {q.label}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className={styles.input}>
        <ChatInput onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  );
}
