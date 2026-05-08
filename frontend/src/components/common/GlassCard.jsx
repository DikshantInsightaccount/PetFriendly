import { motion } from "framer-motion";

export default function GlassCard({ children, className = "", hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={hover ? { y: -6 } : {}}
      className={`glass card-lift p-4 ${className}`}
    >
      {children}
    </motion.div>
  );
}