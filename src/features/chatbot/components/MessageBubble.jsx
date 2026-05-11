import { useMemo, useState } from "react";
import styles from "./MessageBubble.module.css";

function formatTime(ts) {
  try {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } catch {
    return "";
  }
}

export default function MessageBubble({
  message,
  role = "bot",
  text = "",
  loading = false,
  error = false,
  onReact, // optional: (messageId, reaction) => void
}) {
  const resolved = useMemo(() => {
    const m = message || {};
    return {
      id: m.id,
      role: m.role ?? role,
      text: m.text ?? text,
      timestamp: m.timestamp ?? Date.now(),
      meta: m.meta,
    };
  }, [message, role, text]);

  const mine = resolved.role === "user";
  const isBot = resolved.role === "bot";
  const [menuOpen, setMenuOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(resolved.text || "");
      setMenuOpen(false);
    } catch {
      // fallback (silent)
      const el = document.createElement("textarea");
      el.value = resolved.text || "";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      setMenuOpen(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.rowBot} aria-live="polite">
        <div className={styles.avatar} aria-hidden="true">
          🐾
        </div>
        <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.bubbleTyping}`}>
          <div className={styles.typing} aria-label="Bot is typing">
            <span className={styles.dot} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={mine ? styles.rowUser : styles.rowBot}
      aria-live={mine ? "off" : "polite"}
    >
      {!mine && (
        <div className={styles.avatar} aria-hidden="true">
          🐾
        </div>
      )}

      <div
        className={[
          styles.bubble,
          mine ? styles.bubbleUser : styles.bubbleBot,
          error ? styles.bubbleError : "",
        ].join(" ")}
      >
        <div className={styles.text}>{resolved.text}</div>

        <div className={styles.metaRow}>
          <span className={styles.time}>{formatTime(resolved.timestamp)}</span>

          {/* Bot actions (copy, like/dislike) */}
          {isBot && (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Message actions"
                title="Actions"
              >
                ⋯
              </button>

              {menuOpen && (
                <div className={styles.menu} role="menu">
                  <button
                    type="button"
                    className={styles.menuItem}
                    onClick={handleCopy}
                    role="menuitem"
                    aria-label="Copy message"
                  >
                    Copy
                  </button>

                  <button
                    type="button"
                    className={styles.menuItem}
                    onClick={() => {
                      onReact?.(resolved.id, "like");
                      setMenuOpen(false);
                    }}
                    role="menuitem"
                    aria-label="Like message"
                  >
                    👍 Like
                  </button>

                  <button
                    type="button"
                    className={styles.menuItem}
                    onClick={() => {
                      onReact?.(resolved.id, "dislike");
                      setMenuOpen(false);
                    }}
                    role="menuitem"
                    aria-label="Dislike message"
                  >
                    👎 Dislike
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}