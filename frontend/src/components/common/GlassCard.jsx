
import { motion } from "framer-motion";

export default function GlassCard({
  children,
  className = "",
  hover = true,
  ...props       
}) {
  return (
    <motion.div
      {...props}   
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={hover ? { y: -6 } : {}}
      className={`glass card-lift p-4 ${className}`}
      style={{
        cursor: props.onClick ? "pointer" : "default",
        ...props.style,
      }}
    >
      {children}
    </motion.div>
  );
}
