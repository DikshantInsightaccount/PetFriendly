import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import "../styles/home.css";

// ✅ FIXED ICON IMPORTS
import { FaPaw, FaCalendarCheck, FaUserMd, FaStar } from "react-icons/fa";

import {
  FaInstagram,
  FaGithub,
  FaLinkedin,
  FaXTwitter,
  FaEnvelope,
} from "react-icons/fa6";

import ChatWidget from "../features/chatbot/components/ChatWidget";

export default function Home() {
  // ✅ NAVBAR SCROLL EFFECT
  useEffect(() => {
    const nav = document.querySelector(".navbar");
    const handleScroll = () => {
      if (window.scrollY > 30) nav?.classList.add("scrolled");
      else nav?.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ ULTRA POLISH: Mouse-follow glow (desktop pointer only)
  useEffect(() => {
    const isFinePointer =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(pointer:fine)").matches;

    if (!isFinePointer) return;

    const glow = document.querySelector(".mouse-glow");
    if (!glow) return;

    const handleMove = (e) => {
      glow.style.left = `${e.clientX}px`;
      glow.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <>
      <Navbar />

      <div className="home-wrapper">
        {/* ✅ ULTRA POLISH: mouse glow layer */}
        <div className="mouse-glow" aria-hidden="true" />

        <Hero />

        {/* ✅ FEATURES reveal */}
        <motion.div
          initial={{ opacity: 0, y: 46 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <Features />
        </motion.div>

        {/* ✅ TESTIMONIALS reveal */}
        <motion.div
          initial={{ opacity: 0, y: 46 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          viewport={{ once: true, margin: "-80px" }}
        >
          <Testimonials />
        </motion.div>

        {/* ✅ CTA reveal */}
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
   ✅ NAVBAR (fixed + scrollspy highlight)
===================================== */
function Navbar() {
  const [active, setActive] = useState("features");

  // ✅ ULTRA POLISH: Scrollspy (IntersectionObserver = smooth + performant)
  useEffect(() => {
    const ids = ["features", "reviews"];
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // pick the most visible entry
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (visible?.target?.id) setActive(visible.target.id);
      },
      { root: null, threshold: [0.2, 0.35, 0.5], rootMargin: "-20% 0px -55% 0px" }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

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
         <a href="#features" className={`nav-link ${active === "features" ? "active" : ""}`}>
  Features
</a>

<a href="#reviews" className={`nav-link ${active === "reviews" ? "active" : ""}`}>
  Reviews
</a>

          {/* ✅ AUTH BUTTONS */}
          <Link to="/login" className="btn-outline-modern nav-btn">
            Login
          </Link>

          <Link to="/register" className="btn btn-gradient nav-btn">
            Get Started
          </Link>
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
          Modern Healthcare for Your Pets <span className="heroPaw">🐾</span>
        </motion.h1>

        <motion.p
          className="hero-subtitle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55, duration: 0.8 }}
        >
          Manage pets, appointments, and clinic workflows with a premium, seamless experience.
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

  const handleClick = () => {
    if (title.includes("Appointments")) navigate("/app/appointments");
    else if (title.includes("Pet")) navigate("/app/pets");
  };

  // ✅ ULTRA POLISH: 3D Tilt using CSS variables (no conflict with Framer Motion)
  const handleTiltMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const rx = (y - cy) / 18;      // tilt strength
    const ry = (cx - x) / 18;

    card.style.setProperty("--rx", `${rx}deg`);
    card.style.setProperty("--ry", `${ry}deg`);
  };

  const handleTiltLeave = (e) => {
    const card = e.currentTarget;
    card.style.setProperty("--rx", `0deg`);
    card.style.setProperty("--ry", `0deg`);
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
        role="button"
        tabIndex={0}
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

      <div className="stars">
        <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
      </div>

      <p className="testimonialText">{text}</p>
    </motion.div>
  );
}

/* =====================================
   ✅ CTA
===================================== */
function CTA() {
  return (
    <section className="cta-section text-center">
      <div className="container ctaInner">
        <div className="ctaGlow" aria-hidden="true"></div>
        <h3>Create a smarter clinic experience 🚀</h3>
        <p>Efficient, scalable, and built for real-world workflows.</p>

        <div className="ctaButtons">
          <Link to="/register" className="btn btn-light btn-lg mt-3 ctaBtnWhite">
            Create Free Account
          </Link>
          <Link to="/login" className="btn btn-outline-modern btn-lg mt-3 ctaBtnGhost">
            Login
          </Link>
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
      <div className="container footerTop">
        <div className="footerCtaCard">
          <div className="footerCtaLeft">
            <h4>Ready to care smarter?</h4>
            <p>Start managing pets, appointments, and visits in one calm workspace.</p>
          </div>
          <div className="footerCtaRight">
            <Link to="/register" className="btn btn-gradient footerCtaBtn">
              Get Started
            </Link>
            <Link to="/login" className="btn btn-outline-modern footerCtaBtnAlt">
              Login
            </Link>
          </div>
        </div>
      </div>

      <div className="container footer-grid footerMain">
        {/* Brand */}
        <div className="footerBrand">
          <div className="footerBrandRow">
            <span className="footerMark" aria-hidden="true">🐾</span>
            <h4>PawCare</h4>
          </div>
          <p className="footerDesc">
            Modern pet clinic management platform — designed to feel premium, calm, and trustworthy.
          </p>

          <div className="footerSocial">
            <a className="socialBtn" href="#" aria-label="Twitter/X"><FaXTwitter /></a>
            <a className="socialBtn" href="#" aria-label="Instagram"><FaInstagram /></a>
            <a className="socialBtn" href="#" aria-label="LinkedIn"><FaLinkedin /></a>
            <a className="socialBtn" href="#" aria-label="GitHub"><FaGithub /></a>
          </div>
        </div>

        {/* Product */}
        <div className="footerCol">
          <h6>Product</h6>
          <a href="#">Features</a>
          <Link to="/app/appointments">Appointments</Link>
          <Link to="/app/pets">Pets</Link>
        </div>

        {/* Resources */}
        <div className="footerCol">
          <h6>Resources</h6>
          <a href="#">Reviews</a>
          <Link to="/contact">Contact Support</Link>
          <a href="#">Security</a>
        </div>

        {/* Newsletter */}
        <div className="footerCol footerNewsletter">
          <h6>Newsletter</h6>
          <p className="footerMini">
            Monthly updates — product releases & pet-care workflow tips. No spam.
          </p>

          <form className="newsletterForm" onSubmit={(e) => e.preventDefault()}>
            <span className="mailIcon" aria-hidden="true"><FaEnvelope /></span>
            <input type="email" placeholder="Email address" aria-label="Email address" />
            <button type="submit">Subscribe</button>
          </form>

          <div className="footerMini2">By subscribing you agree to our privacy policy.</div>
        </div>
      </div>

      <div className="container footerBottom">
        <div className="footerLegal">
          <span>© 2026 PawCare. All rights reserved.</span>
          <span className="dotSep" aria-hidden="true">•</span>
          <a href="#">Privacy</a>
          <span className="dotSep" aria-hidden="true">•</span>
          <a href="#">Terms</a>
        </div>

        <a className="backTop" href="#">Back to top ↑</a>
      </div>
    </footer>
  );
}