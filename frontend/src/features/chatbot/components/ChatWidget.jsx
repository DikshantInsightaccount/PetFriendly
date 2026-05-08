import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import ChatWindow from "./ChatWindow";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        onClick={() => setOpen((v) => !v)}
        className="btn-premium btn-primary-premium"
        style={{
          position: "fixed",
          right: 22,
          bottom: 22,
          zIndex: 50,
          borderRadius: 999,
          padding: "12px 16px",
          boxShadow: "0 18px 40px rgba(79,107,220,0.25)",
        }}
      >
        {open ? "Close" : "Help"}
      </motion.button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.98 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            style={{ position: "fixed", right: 22, bottom: 74, zIndex: 50, width: 360 }}
          >
            <ChatWindow onClose={() => setOpen(false)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}