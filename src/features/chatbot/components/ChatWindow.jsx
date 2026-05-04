import { useState } from "react";
import GlassCard from "../../../components/common/GlassCard";
import ChatInput from "./ChatInput";
import MessageBubble from "./MessageBubble";

export default function ChatWindow({ onClose }) {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hi! I’m here to help you with pets and appointments." },
  ]);

  const send = (text) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { from: "user", text }]);
    // placeholder response until backend wiring
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: "Got it. I can guide you step-by-step." }]);
    }, 300);
  };

  return (
    <GlassCard hover={false} className="p-0 overflow-hidden">
      <div className="d-flex align-items-center justify-content-between px-3 py-2 border-bottom">
        <div className="fw-bold">Care Assistant</div>
        <button className="btn btn-sm btn-outline-secondary" onClick={onClose}>×</button>
      </div>

      <div style={{ maxHeight: 340, overflow: "auto" }} className="p-3 d-grid gap-2">
        {messages.map((m, i) => <MessageBubble key={i} from={m.from} text={m.text} />)}
      </div>

      <div className="p-3 border-top">
        <ChatInput onSend={send} />
      </div>
    </GlassCard>
  );
}