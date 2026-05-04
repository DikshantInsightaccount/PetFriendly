import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import "../styles/auth.css";

export default function Login() {
  const [role, setRole] = useState("USER");
  const navigate = useNavigate();

  return (
    <div className="auth-wrapper">

      {/* ✅ TOP NAVIGATION */}
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <button
          className="btn btn-outline-light"
          onClick={() => navigate("/")}   // ✅ FIXED
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
              Welcome back 🐾
            </h3>

            <p className="text-muted text-center mb-4">
              Sign in to manage your pet’s health
            </p>

            {/* EMAIL */}
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input
                className="input-premium w-100"
                type="email"
                placeholder="you@example.com"
              />
            </div>

            {/* PASSWORD */}
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input
                className="input-premium w-100"
                type="password"
                placeholder="••••••••"
              />
            </div>

            {/* ROLE */}
            <div className="mb-4">
              <label className="form-label">Login as</label>
              <div className="d-flex gap-2">
                {["USER", "VET", "ADMIN"].map((r) => (
                  <button
                    key={r}
                    type="button"
                    className={`btn btn-sm ${
                      role === r
                        ? "btn-primary"
                        : "btn-outline-secondary"
                    }`}
                    onClick={() => setRole(r)}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* ✅ LOGIN BUTTON */}
            <Button
              variant="paw"
              className="w-100 mb-3"
              onClick={() => navigate("/app/pets")}   // ✅ FIXED
            >
              Login
            </Button>

            {/* REGISTER */}
            <p className="text-center small text-muted mb-0">
              New here?{" "}
              <Link to="/register" className="fw-semibold">
                Create an account
              </Link>
            </p>

          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}