import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import "../styles/auth.css";

export default function Register() {
  const navigate = useNavigate();

  return (
    <div className="auth-wrapper">

      {/* ✅ BACK TO HOME BUTTON */}
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <button
          className="btn btn-outline-light"
          onClick={() => navigate("/")}
        >
          ⬅ Home
        </button>
      </div>

      <div className="auth-content">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <GlassCard hover={false}>
            <h3 className="fw-bold mb-2 text-center">
              Create your account 🐶
            </h3>

            <p className="text-muted text-center mb-4">
              Start caring smarter for your pets
            </p>

            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input
                className="input-premium w-100"
                placeholder="Your name"
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="input-premium w-100"
                type="email"
                placeholder="you@example.com"
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Password</label>
              <input
                className="input-premium w-100"
                type="password"
                placeholder="Create a strong password"
              />
            </div>

            <Button variant="paw" className="w-100 mb-3">
              Create Account
            </Button>

            <p className="text-center small text-muted mb-0">
              Already have an account?{" "}
              <Link to="/" className="fw-semibold">
                Sign in
              </Link>
            </p>

          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}