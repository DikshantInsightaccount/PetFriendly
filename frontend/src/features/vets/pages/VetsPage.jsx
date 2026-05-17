import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import GlassCard from "../../../components/common/GlassCard";
import EmptyState from "../../../components/common/EmptyState";

import { adminApi } from "../../../features/admin/adminApi"; // or your vetsApi

import "../../../styles/vets.css";
import { vetsApi } from "../../../api/modules/vets.api";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function VetsPage() {
  const navigate = useNavigate();

  const [vets, setVets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        const data = await vetsApi.getAllVets(); // adjust API
        if (!alive) return;

        setVets(Array.isArray(data) ? data : []);
      } catch (e) {
        if (!alive) return;
        setErr("Failed to load vets");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => (alive = false);
  }, []);

  if (loading) {
    return <div className="text-muted">Loading vets...</div>;
  }

  if (err) {
    return <div className="alert alert-danger">{err}</div>;
  }

  if (vets.length === 0) {
    return (
      <EmptyState
        title="No vets available"
        subtitle="Try again later or refresh."
      />
    );
  }

  return (
    <div className="vets-page">
      {/* HEADER */}
      <div className="vets-header">
        <div>
          <h2 className="fw-bold">Find Vets 👨‍⚕️</h2>
          <div className="text-muted">
            Discover and book appointments with trusted vets.
          </div>
        </div>
      </div>

      {/* GRID */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="row g-4 mt-3"
      >
        {vets.map((vet, idx) => {
          const vetId = vet.vetId ?? vet.id;

          return (
            <motion.div key={vetId ?? idx} className="col-md-4" variants={item}>
              <GlassCard hover>
                <div className="vet-card">
                  {/* Avatar */}
                  <div className="vet-avatar">
                    👨‍⚕️
                  </div>

                  {/* Info */}
                  <h5 className="vet-name">
                    {vet.name || `Vet #${vetId}`}
                  </h5>

                  <div className="vet-meta">
                    {vet.speciality || "General Vet"}
                  </div>

                  <div className="vet-stats">
                    <span>⭐ 4.{(vetId % 5) + 2}</span>
                    <span>{(vetId % 7) + 3} yrs exp</span>
                  </div>

                  {/* Actions */}
                  <div className="vet-actions">
                    {/* <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => navigate(`/vet/profile`)}
                    >
                      View Profile
                    </button> */}

                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() =>
                        navigate(`/app/book-appointment`, {
                          state: { vetId },
                        })
                      }
                    >
                      Book
                    </button>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}