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

  // FIXED: initialize all as strings
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function validateForm() {
    // Full name validation
    if (!fullName.trim()) {
      return "Full name is required";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }

    // Phone number validation (exactly 10 digits)
    const phoneRegex = /^[0-9]{10}$/;

    if (!phoneRegex.test(phoneNumber)) {
      return "Phone number must be exactly 10 digits";
    }

    // Password validation
    // Minimum 8 chars, 1 uppercase, 1 lowercase,
    // 1 number, 1 special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!passwordRegex.test(password)) {
      return (
        "Password must be at least 8 characters and include uppercase, lowercase, number, and special character"
      );
    }

    return null;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
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
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />

              <input
                className="input-premium w-100 mb-3"
                placeholder="Phone Number"
                maxLength={10}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={loading}
              />

              <input
                className="input-premium w-100 mb-4"
                placeholder="Password"
                type="password"
                minLength={8}
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