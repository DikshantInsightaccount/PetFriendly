import { motion } from "framer-motion";

export default function Button({
  variant = "paw",   
  className = "",
  children,
  type = "button",
  ...props
}) {
  const base = "btn-premium";
  const styles =
    variant === "paw"
      ? "btn-paw-premium"
      : variant === "primary"
      ? "btn-primary-premium"
      : "btn-ghost-premium";

  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18 }}
      className={`${base} ${styles} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}
