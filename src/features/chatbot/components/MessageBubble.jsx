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
  onReact,
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
        <div className={styles.avatar}>🐾</div>

        <div className={`${styles.bubble} ${styles.bubbleBot} ${styles.bubbleTyping}`}>
          <div className={styles.typing}>
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
      {!mine && <div className={styles.avatar}>🐾</div>}

      <div
        className={[
          styles.bubble,
          mine ? styles.bubbleUser : styles.bubbleBot,
          error ? styles.bubbleError : "",
        ].join(" ")}
      >
        {/* ✅ MESSAGE TEXT */}
        <div className={styles.text}>
          {resolved.text}
        </div>

        {/* ✅ META ROW */}
        <div className={styles.metaRow}>
          <span className={styles.time}>
            {formatTime(resolved.timestamp)}
          </span>

          {/* ✅ BOT ACTIONS */}
          {isBot && (
            <div className={styles.actions}>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => setMenuOpen((v) => !v)}
                aria-label="Message actions"
              >
                ⋯
              </button>

              {menuOpen && (
                <div className={styles.menu} role="menu">
                  <button
                    className={styles.menuItem}
                    onClick={handleCopy}
                    role="menuitem"
                  >
                    📋 Copy
                  </button>

                  <button
                    className={styles.menuItem}
                    onClick={() => {
                      onReact?.(resolved.id, "like");
                      setMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    👍 Helpful
                  </button>

                  <button
                    className={styles.menuItem}
                    onClick={() => {
                      onReact?.(resolved.id, "dislike");
                      setMenuOpen(false);
                    }}
                    role="menuitem"
                  >
                    👎 Not helpful
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
