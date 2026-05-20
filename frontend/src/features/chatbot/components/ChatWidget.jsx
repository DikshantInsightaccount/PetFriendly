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
      initial: { opacity: 0, y: 18, scale: 0.98 },
      animate: { opacity: 1, y: 0, scale: 1 },
      exit: { opacity: 0, y: 16, scale: 0.98 },
      transition: { duration: 0.22, ease: "easeOut" },
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
    if (!open) launcherRef.current?.focus?.();
  }, [open]);

  return (
    <>
      {/* Premium Floating Launcher */}
     <motion.button
  ref={launcherRef}
  className={styles.launcher}
  onClick={() => setOpen(!open)}   
  aria-expanded={open}
  aria-controls="pawcare-chat-panel"
>
  <span className={styles.launcherGlow}></span>
  <span className={styles.launcherRing}></span>

  <span className={styles.launcherIcon}>
    🐾
  </span>

  {/* TOOLTIP */}
  <span className={styles.tooltip}>
    Need help? PawCare Assistant 🐾
  </span>
</motion.button>



      {/* Panel wrapper only (no second “card”) */}
      <AnimatePresence>
        {open && (
          <motion.div
            {...motionPanel}
            className={styles.panelWrap}
            role="dialog"
            aria-modal="true"
            aria-label="PawCare Assistant chat window"
          >
            {/* subtle scrim (premium, not foggy) */}
            <button
              type="button"
              className={styles.scrim}
              aria-label="Close chat backdrop"
              onClick={() => setOpen(false)}
            />

            <div
              id="pawcare-chat-panel"
              ref={panelRef}
              className={styles.panel}
              tabIndex={-1}
            >
              <ChatWindow onClose={() => setOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}