import { Link, Navigate, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import "../styles/home.css";
import { useAuth } from "../auth/AuthContext";

import { FaPaw, FaCalendarCheck, FaUserMd, FaStar } from "react-icons/fa";
import {
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaEnvelope,
} from "react-icons/fa6";

// Chat
import ChatWidget from "../features/chatbot/components/ChatWidget";

export default function Home() {
  const { isAuthenticated, role, isLoading } = useAuth();

  // Avoid flicker while /users/me bootstraps
  if (isLoading) return null;

  // Logged-in users should never see marketing hom

  if (isAuthenticated) {
    const redirectPath =
      role === "ADMIN"
        ? "/admin/dashboard"
        : role === "VET"
          ? "/vet/dashboard"
          : "/app/dashboard";

    return <Navigate to={redirectPath} replace />;

  }

  return (
    <>

      <div className="home-wrapper">
        <MouseGlowLayer />

        <Hero />

        {/* FEATURES reveal */}
        <motion.div
          initial={{ opacity: 0, y: 46 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <Features />
        </motion.div>

        {/* TESTIMONIALS reveal */}
        <motion.div
          initial={{ opacity: 0, y: 46 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <Testimonials />
        </motion.div>

        {/* CTA reveal */}
        <motion.div
          initial={{ opacity: 0, y: 46 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <CTA />
        </motion.div>

        <Footer />
      </div>

      <ChatWidget />
    </>
  );
}

/* =====================================
   ULTRA POLISH: Mouse-follow glow layer
   (desktop fine pointer only)
===================================== */
function MouseGlowLayer() {
  const glowRef = useRef(null);

  useEffect(() => {
    const isFinePointer =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer:fine)").matches;

    if (!isFinePointer) return;

    const glow = glowRef.current;
    if (!glow) return;

    const handleMove = (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return <div ref={glowRef} className="mouse-glow" aria-hidden="true" />;
}

/* =====================================
   NAVBAR (fixed + scroll + scrollspy)
   + production auth buttons
===================================== */
function Navbar() {
  const [active, setActive] = useState("features");
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const dashboardPath = useMemo(() => {
    if (role === "ADMIN") return "/admin/dashboard";
    if (role === "VET") return "/vet";
    return "/app/dashboard";
  }, [role]);

  // NAVBAR SCROLL EFFECT (adds .scrolled after 30px)
  useEffect(() => {
    const nav = document.querySelector(".navbar");
    if (!nav) return;

    const handleScroll = () => {
      if (window.scrollY > 30) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ Scrollspy (IntersectionObserver)
  useEffect(() => {
    const ids = ["features", "reviews"];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0)
          )[0];

        if (visible?.target?.id) setActive(visible.target.id);
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5],
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleLogout = async () => {
    // ✅ Clear + redirect in one place (clean flow)
    try {
      await logout?.(); // assumes your AuthContext exposes logout()
    } finally {
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="navbar">
      <div className="container nav-content">
        {/* ✅ LOGO */}
        <div className="brand">
          <span className="brandMark" aria-hidden="true">
            🐾
          </span>
          <h3 className="logo">PawCare</h3>
        </div>

        {/* ✅ NAV LINKS */}
        <div className="nav-links">
          <a
            href="#features"
            className={`nav-link ${active === "features" ? "active" : ""}`}
          >
            Features
          </a>

          <a
            href="#reviews"
            className={`nav-link ${active === "reviews" ? "active" : ""}`}
          >
            Reviews
          </a>

          {/* ✅ AUTH BUTTONS (clear + best practice) */}
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="btn-outline-modern nav-btn">
                Login
              </Link>

              <Link to="/register" className="btn btn-gradient nav-btn">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to={dashboardPath} className="btn btn-gradient nav-btn">
                Dashboard
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="btn-outline-modern nav-btn"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* =====================================
   ✅ HERO (ADVANCED)
===================================== */
function Hero() {
  return (
    <section className="hero-section text-center">
      {/* ✅ Floating Blobs */}
      <div className="blob" aria-hidden="true"></div>
      <div className="blob blob-2" aria-hidden="true"></div>

      <motion.div
        className="container hero-inner"
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
        >
          Modern Healthcare for Your Pets{" "}
          <span className="heroPaw">🐾</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8 }}
        >
          Manage pets, appointments, and clinic workflows with a premium,
          seamless experience.
        </motion.p>

        <motion.div
          className="hero-buttons"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.85, duration: 0.7 }}
        >
          <Link to="/register" className="btn btn-gradient btn-lg ctaPrimary">
            Get Started
          </Link>

          <Link to="/login" className="btn btn-outline-modern btn-lg ctaSecondary">
            Login
          </Link>
        </motion.div>

        {/* ✅ Mini trust line */}
        <div className="heroTrust">
          <span className="trustDot" aria-hidden="true"></span>
          Trusted by pet parents for clean, reliable clinic workflows
        </div>
      </motion.div>
    </section>
  );
}

/* =====================================
   ✅ FEATURES
===================================== */
function Features() {
  return (
    <section id="features" className="features-section">
      <div className="container">
        <div className="row g-4 text-center">
          <Feature
            icon={<FaPaw />}
            title="Pet & Owner Management"
            description="Centralized profiles, structured records, and effortless access."
          />

          <Feature
            icon={<FaCalendarCheck />}
            title="Appointments & Visits"
            description="Smooth scheduling, real-time tracking, and seamless workflows."
          />

          <Feature
            icon={<FaUserMd />}
            title="Trusted by Pet Owners"
            description="Built to feel calm, modern, and dependable — every visit."
          />
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title, description }) {
  const navigate = useNavigate();

  const handleClick = useCallback(() => {
    if (title.includes("Appointments")) navigate("/app/appointments");
    else if (title.includes("Pet")) navigate("/app/pets");
  }, [navigate, title]);

  // ✅ 3D Tilt using CSS variables (no conflict with Framer Motion)
  const handleTiltMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rx = (y - cy) / 18;
    const ry = (cx - x) / 18;

    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
  };

  const handleTiltLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", `0deg`);
    card.style.setProperty("--ry", `0deg`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div className="col-md-4">
      <motion.div
        className="feature-card"
        whileHover={{ y: -10, scale: 1.04 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleClick}
        onMouseMove={handleTiltMove}
        onMouseLeave={handleTiltLeave}
        onKeyDown={handleKeyDown}
        role="button"
        tabIndex={0}
        aria-label={`Explore ${title}`}
      >
        <div className="feature-icon">{icon}</div>
        <h5>{title}</h5>
        <p>{description}</p>
        <div className="featureHint">Explore →</div>
      </motion.div>
    </div>
  );
}

/* =====================================
   ✅ TESTIMONIALS
===================================== */
function Testimonials() {
  return (
    <section id="reviews" className="testimonials-section">
      <div className="container text-center">
        <h2 className="section-title">Loved by Pet Owners 🐾</h2>

        <div className="testimonial-grid">
          <Testimonial
            name="Ankit Sharma"
            role="Dog parent"
            text="Booking appointments has never been easier. Everything feels smooth and modern."
          />
          <Testimonial
            name="Riya Patel"
            role="Cat parent"
            text="I can manage records quickly and always know what happened in past visits."
          />
          <Testimonial
            name="Kunal Mehta"
            role="Pet parent"
            text="This feels like a real premium product — clean UI and great flow."
          />
        </div>
      </div>
    </section>
  );
}

function Testimonial({ name, role, text }) {
  return (
    <motion.div
      className="testimonial-card"
      whileHover={{ scale: 1.06, rotate: -0.6 }}
    >
      <div className="testimonialTop">
        <div className="avatar" aria-hidden="true">
          {name
            .split(" ")
            .map((p) => p[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div className="who">
          <div className="whoName">{name}</div>
          <div className="whoRole">{role}</div>
        </div>
      </div>

      <div className="stars" aria-label="5 star rating">
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
      </div>

      <p className="testimonialText">{text}</p>
    </motion.div>
  );
}

/* =====================================
   ✅ CTA
===================================== */

function CTA() {
  const services = [
    {
      title: "General Checkup",
      desc: "Routine health evaluations, preventive care, and wellness guidance for pets.",
      image: "/images/services/general-checkup.jpg",
      large: true,
      accent: "blue",
    },
    {
      title: "Vaccination",
      desc: "Vaccination schedules, booster guidance, and preventive care planning.",
      image: "/images/services/vaccination.jpg",
      accent: "violet",
    },
    {
      title: "Dental Care",
      desc: "Oral checkups, gum health review, and dental hygiene consultation.",
      image: "/images/services/dental.jpg",
      accent: "cyan",
    },
    {
      title: "Skin & Allergy",
      desc: "Rashes, itching, coat issues, and allergy-related consultation support.",
      image: "/images/services/skin-allergy.jpg",
      accent: "pink",
    },
    {
      title: "Nutrition Advice",
      desc: "Diet planning, weight management, and feeding recommendations.",
      image: "/images/services/nutrition.jpg",
      accent: "green",
    },
    {
      title: "Emergency Triage",
      desc: "Guidance for urgent concerns and quick clinic appointment decisions.",
      image: "/images/services/emergency.jpg",
      accent: "orange",
    },
  ];

  return (
    <section className="cta-section services-showcase">
      <div className="container">
        <div className="services-head text-center">
          <div className="services-kicker">Pet Clinic • Consultations</div>

          <h2 className="services-title">
            Services We Provide <span>🐾</span>
          </h2>

          <p className="services-subtitle">
            Explore premium consultation types designed to keep your pets healthy,
            happy, and cared for.
          </p>
        </div>

        <div className="services-bento">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              className={`service-bento-card ${service.large ? "large" : ""
                } accent-${service.accent}`}
              initial={{ opacity: 0, y: 40, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <div className="service-bento-imageWrap">
                <img
                  src={service.image}
                  alt={service.title}
                  className="service-bento-image"
                />
                <div className="service-bento-overlay" />
                <div className="service-badge">Consultation</div>
              </div>

              <div className="service-bento-content">
                <h3>{service.title}</h3>
                <p>{service.desc}</p>

                <div className="service-bento-footer">
                  <span className="service-chip">Pet Care</span>
                  {/* <span className="service-link">Explore →</span> */}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* =====================================
   ✅ PREMIUM FOOTER
===================================== */
function Footer() {
  return (
    <footer className="footer">
      {/* Footer CTA strip */}
      {/* <div className="container footerTop">
        <div className="footerCtaCard">
          <div className="footerCtaLeft">
            <h4>Ready to care smarter?</h4>
            <p>
              Start managing pets, appointments, and visits in one calm
              workspace.
            </p>
          </div>
          <div className="footerCtaRight">
            <Link to="/register" className="btn btn-gradient footerCtaBtn">
              Get Started
            </Link>
            <Link
              to="/login"
              className="btn btn-outline-modern footerCtaBtnAlt"
            >
              Login
            </Link>
          </div>
        </div>
      </div> */}

      <div className="container footer-grid footerMain">
        {/* Brand */}
        <div className="footerBrand">
          <div className="footerBrandRow">
            <span className="footerMark" aria-hidden="true">
              🐾
            </span>
            <h4>PawCare</h4>
          </div>
          <p className="footerDesc">
            Modern pet clinic management platform — designed to feel premium,
            calm, and trustworthy.
          </p>

          <div className="footerSocial">
            <a className="socialBtn" href="#" aria-label="Twitter/X">
              <FaXTwitter />
            </a>
            <a className="socialBtn" href="#" aria-label="Instagram">
              <FaInstagram />
            </a>
            <a className="socialBtn" href="#" aria-label="LinkedIn">
              <FaLinkedin />
            </a>
            <a className="socialBtn" href="#" aria-label="GitHub">
              <FaGithub />
            </a>
          </div>
        </div>

        {/* Product */}
        <div className="footerCol">
          <h6>Product</h6>
          <a href="#features">Features</a>
          <Link to="/app/appointments">Appointments</Link>
          <Link to="/app/pets">Pets</Link>
        </div>

        {/* Resources */}
        <div className="footerCol">
          <h6>Resources</h6>
          <a href="#reviews">Reviews</a>
          <Link to="/contact">Contact Support</Link>
          <a href="#">Security</a>
        </div>

        {/* Newsletter */}
        <div className="footerCol footerNewsletter">
          <h6>Newsletter</h6>
          <p className="footerMini">
            Monthly updates — product releases & pet-care workflow tips. No spam.
          </p>

          <form
            className="newsletterForm"
            onSubmit={(e) => e.preventDefault()}
          >
            <span className="mailIcon" aria-hidden="true">
              <FaEnvelope />
            </span>
            <input
              type="email"
              placeholder="Email address"
              aria-label="Email address"
            />
            <button type="submit">Subscribe</button>
          </form>

          <div className="footerMini2">
            By subscribing you agree to our privacy policy.
          </div>
        </div>
      </div>

      <div className="container footerBottom">
        <div className="footerLegal">
          <span>© 2026 PawCare. All rights reserved.</span>
          <span className="dotSep" aria-hidden="true">
            •
          </span>
          <a href="#">Privacy</a>
          <span className="dotSep" aria-hidden="true">
            •
          </span>
          <a href="#">Terms</a>
        </div>

        <a className="backTop" href="#">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}
