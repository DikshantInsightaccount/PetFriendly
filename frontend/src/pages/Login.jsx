import { motion } from "framer-motion";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import GlassCard from "../components/common/GlassCard";
import Button from "../components/common/Button";
import "../styles/auth.css";

import { useAuth } from "../auth/AuthContext";

function getErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Login failed"
  );
}

export default function Login() {
  const [role, setRole] = useState("USER");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // If redirected by RequireAuth, it sets state.from
  const from = location.state?.from?.pathname || "/app/pets";

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required.");
      return;
    }

    try {
      setLoading(true);

      const profile = await login({
        email: email.trim(),
        password,
        role,
      });

      // ✅ Correct routing based on your App.jsx
      if (profile?.role === "ADMIN") {
        navigate("/admin/dashboard", { replace: true });
      } else if (profile?.role === "VET") {
        navigate("/vet", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div style={{ position: "absolute", top: "20px", left: "20px" }}>
        <button className="btn btn-outline-light" onClick={() => navigate("/")}>
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
            <h3 className="fw-bold mb-2 text-center">Welcome back 🐾</h3>
            <p className="text-muted text-center mb-4">
              Sign in to manage your pet’s health
            </p>

            {error && (
              <div className="alert alert-danger py-2 small" role="alert">
                {error}
              </div>
            )}

            <form onSubmit={onSubmit}>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  className="input-premium w-100"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  className="input-premium w-100"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Login as</label>
                <div className="d-flex gap-2">
                  {["USER", "VET", "ADMIN"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      className={`btn btn-sm ${
                        role === r ? "btn-primary" : "btn-outline-secondary"
                      }`}
                      onClick={() => setRole(r)}
                      disabled={loading}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                variant="paw"
                className="w-100 mb-3"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
            </form>

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