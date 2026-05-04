import { motion } from "framer-motion";
import GlassCard from "../components/common/GlassCard";
import PetCard from "../features/pets/components/PetCard";
import VisitTimeline from "../features/visits/components/VisitTimeline";
import AiInsightCard from "../components/common/AiInsightCard";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function UserDashboard() {
  // ---- Mock data (frontend only) ----
  const pets = [
    { name: "Milo", type: "Dog", status: "Healthy" },
    { name: "Luna", type: "Cat", status: "Needs Visit" },
  ];

  const visits = [
    { title: "Milo – Annual Checkup", when: "Tomorrow, 10:30 AM" },
    { title: "Luna – Vaccination", when: "Apr 29, 4:00 PM" },
  ];

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="container py-4"
    >
      {/* ---- Hero ---- */}
      <motion.div variants={item} className="mb-4">
        <GlassCard hover={false}>
          <h2 className="fw-bold mb-1">
            Good morning 👋
          </h2>
          <p className="text-muted mb-0">
            Here’s how your pets are doing today.
          </p>
        </GlassCard>
      </motion.div>

      {/* ---- Insights + Visits ---- */}
      <motion.div variants={item} className="row g-3 mb-4">
        <div className="col-md-6">
          <AiInsightCard
            greeting="Milo is doing great 🐕"
            points={[
              "Last visit was 3 months ago",
              "Vaccination status is up to date",
            ]}
            suggestion="Consider scheduling Luna’s vaccination this week."
          />
        </div>

        <div className="col-md-6">
          <VisitTimeline visits={visits} />
        </div>
      </motion.div>

      {/* ---- Pets ---- */}
      <motion.div variants={item}>
        <h4 className="fw-bold mb-3">
          Your Pets
        </h4>

        <div className="row g-3">
          {pets.map((pet, idx) => (
            <div key={idx} className="col-md-4">
              <PetCard pet={pet} />
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}