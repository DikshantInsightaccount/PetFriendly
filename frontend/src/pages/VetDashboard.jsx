import { useState } from "react";

import "../styles/home.css";
import { Link } from "react-router-dom";
import { FaPaw, FaCalendarCheck, FaUserMd, FaRobot } from "react-icons/fa";

export default function VetDashboard() {
  const [activeTab, setActiveTab] = useState("details");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex justify-center px-6 py-10">
      <div className="w-full max-w-6xl">

        {/* Header
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">
          Admin Dashboard
        </h1> */}
        <section className="hero-section text-center">
      <div className="container">
        <h1 className="hero-title">
          🐾 Vet Dashboard
        </h1>

        <p className="hero-subtitle">
          Manage pets, appointments, vets, and AI-powered support — all in one place.
        </p>
      </div>
    </section>
   <section className="features-section">
  <div className="max-w-6xl mx-auto">
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center"
      style={{ display: "grid" }}
    >

      <Link to="/vet_leaves" className="feature-card inline-block">
        <FaPaw size={36} className="mx-auto mb-4 text-blue-500" />
        <h3 className="text-xl font-semibold">Leaves</h3>
        <p>Apply Leaves here</p>
      </Link>

     

    </div>
  </div>
</section>


    

      </div>
    </div>
  );
}