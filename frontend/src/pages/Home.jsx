import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import "../styles/home.css";
import { FaPaw, FaCalendarCheck, FaRobot } from "react-icons/fa";

export default function Home() {
  const { isAuthenticated, role, isLoading } = useAuth();

  // Avoid flicker while /users/me bootstraps
  if (isLoading) return null;

  // ✅ Logged-in users should never see marketing home
  if (isAuthenticated) {
    if (role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
    if (role === "VET") return <Navigate to="/vet" replace />;
    return <Navigate to="/app/pets" replace />;
  }

  // ✅ Public landing page
  return (
    <div className="home-wrapper">
      <div className="home-content">
        <Hero />
        <Features />
        <CTA />
      </div>
    </div>
  );
}

/* ---------- HERO ---------- */
function Hero() {
  return (
    <section className="hero-section text-center">
      <div className="container">
        <h1 className="hero-title">🐾 Smart Pet Clinic Platform</h1>
        <p className="hero-subtitle">
          Manage pets, appointments, vets, and AI-powered support — all in one place.
        </p>

        <div className="hero-buttons">
          <Link to="/register" className="btn btn-gradient btn-lg">
            Get Started
          </Link>

          <Link to="/login" className="btn btn-outline-modern btn-lg">
            Login
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------- FEATURES ---------- */
function Features() {
  return (
    <section className="features-section">
      <div className="container">
        <div className="row g-4 text-center">
          <Feature
            icon={<FaPaw />}
            title="Pet & Owner Management"
            description="Centralized pet records with quick access and structured workflows."
          />
          <Feature
            icon={<FaCalendarCheck />}
            title="Appointments & Visits"
            description="Smart scheduling and real-time visit tracking with seamless booking."
          />
          <Feature
            icon={<FaRobot />}
            title="AI-Powered Support"
            description="Integrated chatbot for instant help and customer assistance."
          />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, description }) {
  return (
    <div className="col-md-4">
      <div className="feature-card">
        <div className="feature-icon">{icon}</div>
        <h5 className="fw-semibold mt-3">{title}</h5>
        <p className="text-muted mt-2">{description}</p>
      </div>
    </div>
  );
}

/* ---------- CTA ---------- */
function CTA() {
  return (
    <section className="cta-section text-center">
      <div className="container">
        <h3 className="cta-title">Start managing your clinic today 🚀</h3>
        <p className="cta-subtitle">
          Built for scalability, clarity, and real-world workflows.
        </p>

        <Link to="/register" className="btn btn-light btn-lg mt-3">
          Create Free Account
        </Link>
      </div>
    </section>
  );
}
