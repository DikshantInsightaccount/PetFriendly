import { useState } from "react";
import { motion } from "framer-motion";
import GlassCard from "../../../components/common/GlassCard";

import "../../../styles/support.css";

export default function SupportPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Support form:", form);

    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="support-page">
      <div className="container py-4">

        {/* HEADER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="support-header">
            <h2>Support Center 🐾</h2>
            <p className="text-muted">
              Need help? Reach out or use quick actions below.
            </p>
          </div>
        </motion.div>

        {/* EMERGENCY BANNER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="support-emergency">
            🚑 Emergency? Call immediately:
            <span> 1800-123-456</span>
          </div>
        </motion.div>

        <div className="row g-3 mt-2">

          {/* CONTACT FORM */}
          <div className="col-md-6">
            <GlassCard>
              <h5 className="mb-3">💬 Contact Us</h5>

              {sent && (
                <div className="alert alert-success">
                  Message sent successfully! 
                  We will get back to you!
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <input
                  className="form-control mb-2"
                  placeholder="Your Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />

                <input
                  className="form-control mb-2"
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />

                <textarea
                  className="form-control mb-3"
                  rows="4"
                  placeholder="Describe your issue..."
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                />

                <button className="btn btn-primary w-100">
                  Send Message
                </button>
              </form>
            </GlassCard>
          </div>

          {/* ✅ QUICK ACTIONS */}
          <div className="col-md-6">
            <GlassCard>
              <h5 className="mb-3">⚡ Quick Help</h5>

              <div className="support-actions">

                <ActionCard
                  title="Chat Assistant"
                  icon="🤖"
                  desc="Instant help from AI assistant"
                  onClick={() =>
                    document.querySelector(".chat-widget-toggle")?.click()
                  }
                />

                <ActionCard
                  title="Book Appointment"
                  icon="📅"
                  desc="Talk to a vet quickly"
                  onClick={() => (window.location.href = "/app/book-appointment")}
                />

                <ActionCard
                  title="View Appointments"
                  icon="🗓️"
                  desc="Check visit history"
                  onClick={() => (window.location.href = "/app/pets-appointments")}
                />

                <ActionCard
                  title="Pet Care Tips"
                  icon="💡"
                  desc="Get helpful guidance"
                  onClick={() =>
                    document.querySelector(".chat-widget-toggle")?.click()
                  }
                />
              </div>
            </GlassCard>
          </div>
        </div>

        {/* ✅ FAQ SECTION */}
        <div className="mt-4">
          <GlassCard>
            <h5 className="mb-3">❓ Frequently Asked Questions</h5>

            <div className="support-faq">
              <Faq q="How to book appointment?" a="Go to Book Appointment section from dashboard." />
              <Faq q="Where to see visits?" a="Check Health Records or Appointments page." />
              <Faq q="When to visit vet?" a="If symptoms persist or worsen, book appointment immediately." />
            </div>
          </GlassCard>
        </div>

      </div>
    </div>
  );
}

function ActionCard({ title, icon, desc, onClick }) {
  return (
    <div className="support-action" onClick={onClick}>
      <div className="support-action-icon">{icon}</div>
      <div>
        <div className="support-action-title">{title}</div>
        <div className="support-action-desc">{desc}</div>
      </div>
    </div>
  );
}

function Faq({ q, a }) {
  return (
    <div className="faq-item">
      <div className="faq-q">{q}</div>
      <div className="faq-a">{a}</div>
    </div>
  );
}