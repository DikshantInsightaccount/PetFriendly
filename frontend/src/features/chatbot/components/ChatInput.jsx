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
      
      {/*  Input wrapper (for premium look) */}
      <div className={styles.inputWrapper}>

        <textarea
          rows={1}
          placeholder="Ask about your pet’s health..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKey}
          disabled={disabled}
          className={styles.textarea}
        />

        {/*  Floating send button */}
        <button
          onClick={handleSend}
          disabled={disabled}
          className={styles.sendBtn}
          aria-label="Send"
        >
          ➤
        </button>

      </div>
    </div>
  );
}