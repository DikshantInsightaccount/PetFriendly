import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import "../styles/auth.css";

import { useAuth } from "../auth/AuthContext";

function getErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Registration failed"
  );
}

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  // ✅ FIXED: initialize all as strings
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // ✅ FIX

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // ✅ safe trims
    if (
      !fullName.trim() ||
      !email.trim() ||
      !password.trim() ||
      !phoneNumber.trim()
    ) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);

      await register({
        name: fullName.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim(), 
      });

      navigate("/login", { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
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

            {error && (
              <div className="alert alert-danger py-2 small">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit}>
              <input
                className="input-premium w-100 mb-3"
                placeholder="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={loading}
              />

              <input
                className="input-premium w-100 mb-3"
                placeholder="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <input
                className="input-premium w-100 mb-3"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)} // ✅ FIX
                disabled={loading}
              />

              <input
                className="input-premium w-100 mb-4"
                placeholder="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />

              <Button
                type="submit"
                variant="paw"
                className="w-100"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Account"}
              </Button>
            </form>

            <p className="text-center mt-3">
              Already have an account?{" "}
              <Link to="/login">Login</Link>
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}