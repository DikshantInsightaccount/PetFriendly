import { motion } from "framer-motion";
import PetCard from "../components/PetCard";

/* ---------- Motion variants ---------- */
const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

export default function PetsPage() {
  // Placeholder data until API is connected
  const pets = [
    {
      name: "Milo",
      type: "Dog",
      status: "Healthy",
      note: "Next checkup due soon.",
    },
    {
      name: "Luna",
      type: "Cat",
      status: "Needs Visit",
      note: "Vaccination reminder.",
    },
    {
      name: "Coco",
      type: "Bird",
      status: "Healthy",
      note: "All good this month.",
    },
  ];

  return (
    <div>
      <div className="d-flex align-items-end justify-content-between mb-3">
        <div>
          <h2 className="fw-bold mb-1">Your Pets</h2>
          <div className="text-muted">
            A calm overview of everyone you care for.
          </div>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="row g-3"
      >
        {pets.map((pet, idx) => (
          <motion.div
            key={idx}
            variants={item}
            className="col-md-4"
          >
            <PetCard pet={pet} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}