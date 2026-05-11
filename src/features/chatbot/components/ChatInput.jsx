import { useState } from "react";
import styles from "./ChatInput.module.css";

export default function ChatInput({ onSend, disabled }) {
  const [text, setText] = useState("");

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText("");
  };

  return (
    <div className={styles.container}>
      <textarea
        rows={1}
        placeholder="Type your message..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKey}
        aria-label="Chat input"
      />

      <div className={styles.actions}>
        <button>📎</button>
        <button>😊</button>
        <button>🎤</button>
        <button onClick={handleSend} disabled={disabled} aria-label="Send">
          ➤
        </button>
      </div>
    </div>
  );
}