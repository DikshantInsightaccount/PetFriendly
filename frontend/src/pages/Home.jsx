import { Link } from "react-router-dom";
import "../styles/home.css";
import { FaPaw, FaCalendarCheck, FaUserMd, FaRobot } from "react-icons/fa";

export default function Home() {
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
        <h1 className="hero-title">
          🐾 Smart Pet Clinic Platform
        </h1>

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
        <h3 className="cta-title">
          Start managing your clinic today 🚀
        </h3>

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
``