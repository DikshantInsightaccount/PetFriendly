import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ChatWindow from "./ChatWindow";
import styles from "./ChatWidget.module.css";

function getFocusable(container) {
  if (!container) return [];
  return Array.from(
    container.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
  );
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const launcherRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  const motionPanel = useMemo(() => {
    if (shouldReduceMotion) {
      return {
        initial: { opacity: 1 },
        animate: { opacity: 1 },
        exit: { opacity: 1 },
        transition: { duration: 0 },
      };
    }
    return {
      initial: { opacity: 0, y: 22, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 22, scale: 0.98 },
      transition: { duration: 0.18, ease: "easeOut" },
    };
  }, [shouldReduceMotion]);

  // ESC to close + basic focus trap
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
        return;
      }

      if (e.key === "Tab") {
        const focusables = getFocusable(panelRef.current);
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;

        if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown, true);

    // Move focus into panel on open
    const t = setTimeout(() => {
      const focusables = getFocusable(panelRef.current);
      (focusables[0] || panelRef.current)?.focus?.();
    }, 0);

    return () => {
      clearTimeout(t);
      document.removeEventListener("keydown", onKeyDown, true);
    };
  }, [open]);

  // Return focus to launcher when closed
  useEffect(() => {
    if (!open) {
      launcherRef.current?.focus?.();
    }
  }, [open]);

  return (
    <>
      {/* ✅ Floating Launcher */}
      <motion.button
        ref={launcherRef}
        type="button"
        whileHover={shouldReduceMotion ? undefined : { y: -2 }}
        whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
        onClick={() => setOpen((v) => !v)}
        className={styles.launcher}
        aria-label={open ? "Close PawCare Assistant" : "Open PawCare Assistant"}
        aria-expanded={open}
        aria-controls="pawcare-chat-panel"
      >
        <span className={styles.launcherIcon} aria-hidden="true">
          {open ? "✕" : "🐾"}
        </span>

        {/* Tooltip (hover + keyboard focus) */}
        <span className={styles.tooltip} role="tooltip">
          Need help? Ask PawCare 🐾
        </span>
      </motion.button>

      {/* ✅ Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            {...motionPanel}
            className={styles.panelWrap}
            role="dialog"
            aria-modal="true"
            aria-label="PawCare Assistant chat window"
          >
            <div
              id="pawcare-chat-panel"
              ref={panelRef}
              className={styles.panel}
              tabIndex={-1}
            >
              {/* Header */}
              <div className={styles.header}>
                <div className={styles.headerLeft}>
                  <div className={styles.titleRow}>
                    <span className={styles.title}>PawCare Assistant</span>
                  </div>
                  <div className={styles.statusRow} aria-live="polite">
                    <span className={styles.statusDot} aria-hidden="true" />
                    <span className={styles.statusText}>Online</span>
                  </div>
                </div>

                <div className={styles.headerActions}>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => setOpen(false)}
                    aria-label="Minimize chat"
                    title="Minimize"
                  >
                    —
                  </button>
                  <button
                    type="button"
                    className={styles.iconBtn}
                    onClick={() => setOpen(false)}
                    aria-label="Close chat"
                    title="Close"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Body (Chat content) */}
              <div className={styles.body}>
                <ChatWindow onClose={() => setOpen(false)} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
