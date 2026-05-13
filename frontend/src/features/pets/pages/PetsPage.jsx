// src/features/pets/pages/PetsPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { petsApi } from "../../../api/modules/pets.api";
import PetCard from "../components/PetCard";
import PetForm from "../components/PetForm";

/* ---------- Motion variants ---------- */
const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  return [];
};

export default function PetsPage() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const normalizePetId = (value) => {
    if (value === undefined || value === null) return null;
    const str = String(value).trim();
    if (!str || str === "undefined" || str === "null") return null;
    return str;
  };

  useEffect(() => {
    let alive = true;

    const loadPets = async () => {
      try {
        const raw = await petsApi.getMyPets();
        const list = unwrapList(raw);
        if (!alive) return;
        setPets(list);
      } catch (err) {
        console.error("Failed to load pets", err);
        if (!alive) return;
        setPets([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    loadPets();
    return () => {
      alive = false;
    };
  }, []);

  const handlePetAdded = (newPet) => {
    setPets((prev) => [...prev, newPet]);
  };

  if (loading) {
    return <div className="text-muted">Loading pets...</div>;
  }

  return (
    <div>
      {/* HEADER */}
      <div className="d-flex align-items-end justify-content-between mb-3">
        <div>
          <h2 className="fw-bold mb-1">Your Pets</h2>
          <div className="text-muted">
            A calm overview of everyone you care for.
          </div>
        </div>

        {/* Appointments OVERVIEW */}
        <button
          className="btn btn-primary"
          onClick={() => navigate("/app/pets-appointments")}
        >
          View Appointments
        </button>
      </div>

      {/* ADD PET */}
      <PetForm onPetAdded={handlePetAdded} />

      {/* PET CARDS */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="row g-3"
      >
        {pets.map((pet, index) => {
          const petId = normalizePetId(
            pet.petId ?? pet.id ?? pet.pet_id ?? pet._id
          );

          return (
            <motion.div
              key={petId ?? index}
              variants={item}
              className="col-md-4"
            >
              <PetCard
                pet={{
                  petId,
                  name: pet.name,
                  type: pet.type,
                  status: pet.isDeleted ? "Inactive" : "Active",
                  note: pet.breed,
                }}
                onClick={() => {
                  if (!petId) return;

                  // ✅ THIS IS THE ONLY CLICK HANDLER
                  navigate(`/app/pets/${petId}`, {
                    state: { pet },
                  });
                }}
              />
            </motion.div>
          );
        })}
      </motion.div>

      {pets.length === 0 && (
        <div className="text-muted mt-4">No pets added yet.</div>
      )}
    </div>
  );
}