import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
 
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
 
export default function UserLayout() {
  return (
    <div className="app-layout">
 
      {/* Navbar */}
      <Navbar />
 
      {/* Main Content */}
      <motion.main
        className="app-main"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="app-container">
          <Outlet />
        </div>
      </motion.main>
 
      {/* Footer */}
      <Footer />
 
    </div>
  );
}