// src/features/appointments/pages/PetAppointments.jsx

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { tokenStore } from "../../../auth/tokenStore";

import { appointmentsApi } from "../../../api/modules/appointments.api";
import { petsApi } from "../../../api/modules/pets.api";
import { vetsApi } from "../../../api/modules/vets.api";

/* -------------------------
   Safe response unwrappers
   ------------------------- */
const unwrapList = (res) => {
  if (Array.isArray(res)) return res;
  if (Array.isArray(res?.data)) return res.data;
  if (Array.isArray(res?.data?.data)) return res.data.data;
  if (Array.isArray(res?.items)) return res.items;
  return [];
};

const unwrapObj = (res) => {
  return res?.data?.data ?? res?.data ?? res;
};

export default function PetAppointments() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // If you navigated from PetCard, we’ll receive petId here
  const selectedPetId = location?.state?.petId ?? null;
  const selectedPetName = location?.state?.petName ?? "";

  const [appointments, setAppointments] = useState([]);
  const [petMap, setPetMap] = useState({});
  const [vetMap, setVetMap] = useState({});
  const [typeMap, setTypeMap] = useState({});

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /* ===============================
     LOAD MY APPOINTMENTS (ALL)
     =============================== */
  useEffect(() => {
    let alive = true;

    const run = async () => {
      setLoading(true);
      setError("");

      if (!isAuthenticated) {
        if (!alive) return;
        setError("You are not authenticated.");
        setLoading(false);
        return;
      }

      // keep the old safety: authenticated but no token => fail clearly
      const token = tokenStore.get();
      if (!token) {
        if (!alive) return;
        setError("Missing auth token.");
        setLoading(false);
        return;
      }

      try {
        const raw = await appointmentsApi.my();
        const list = unwrapList(raw);

        // You said you want previous + current, so NO upcoming-only filter.
        // If user came from a pet card, filter to that pet.
        const filtered = selectedPetId
          ? list.filter((a) => String(a.petId) === String(selectedPetId))
          : list;

        // Optional: sort newest first (feel free to reverse)
        filtered.sort((a, b) => {
          const da = new Date(`${a.slotDate}T${a.slotStartTime || "00:00"}`);
          const db = new Date(`${b.slotDate}T${b.slotStartTime || "00:00"}`);
          return db - da;
        });

        if (!alive) return;
        setAppointments(filtered);
      } catch (e) {
        console.error(e);
        if (!alive) return;
        setError("Failed to load appointments.");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    run();
    return () => {
      alive = false;
    };
  }, [isAuthenticated, selectedPetId]);

  /* ===============================
     LOAD PET / VET / TYPE METADATA
     =============================== */
  useEffect(() => {
    let alive = true;
    if (appointments.length === 0) return;

    const petIds = [...new Set(appointments.map((a) => a.petId).filter(Boolean))];
    const vetIds = [...new Set(appointments.map((a) => a.vetId).filter(Boolean))];
    const typeIds = [...new Set(appointments.map((a) => a.appointmentTypeId).filter(Boolean))];

    const loadMeta = async () => {
      try {
        // PETS
        const petResults = await Promise.all(
          petIds.map(async (id) => {
            try {
              const res = await petsApi.getPetById(id);
              const p = unwrapObj(res);
              return { id, name: p?.name ?? p?.data?.name ?? "—" };
            } catch (e) {
              console.error("Pet fetch failed for", id, e);
              return { id, name: "—" };
            }
          })
        );

        // VETS
        const vetResults = await Promise.all(
          vetIds.map(async (id) => {
            try {
              const res = await vetsApi.getVetById(id);
              const v = unwrapObj(res);
              // handle both {name} and {data:{name}}
              const name = v?.name ?? v?.data?.name ?? v?.data?.data?.name ?? "—";
              return { id, name };
            } catch (e) {
              console.error("Vet fetch failed for", id, e);
              return { id, name: "—" };
            }
          })
        );

        // TYPES (fetch once)
        const typesRes = await vetsApi.getAppointmentTypes();
        const typesList = unwrapList(typesRes);

        const nextPetMap = {};
        petResults.forEach((r) => (nextPetMap[r.id] = r.name));

        const nextVetMap = {};
        vetResults.forEach((r) => (nextVetMap[r.id] = r.name));

        const nextTypeMap = {};
        typesList.forEach((t) => {
          const id = t?.appointmentTypeId ?? t?.id;
          const name = t?.name;
          if (id != null) nextTypeMap[id] = name ?? "—";
        });

        // Optional: if API returns all types, we still only need those in appointments
        // but keeping all is fine.
        if (!alive) return;
        setPetMap(nextPetMap);
        setVetMap(nextVetMap);
        setTypeMap(nextTypeMap);
      } catch (e) {
        console.error("Meta load failed", e);
      }
    };

    loadMeta();
    return () => {
      alive = false;
    };
  }, [appointments]);

  /* ===============================
     HELPERS
     =============================== */
  const formatDateTime = (date, time) =>
    new Date(`${date}T${time || "00:00"}`).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  const badgeClass = useMemo(() => {
    return (status) => {
      if (status === "COMPLETED") return "bg-secondary";
      if (status === "CANCELLED") return "bg-danger";
      return "bg-success";
    };
  }, []);

  /* ===============================
     RENDER
     =============================== */
  return (
    <div className="container py-4">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate("/app/pets")}
      >
        ← Back to Pets
      </button>

      <div className="card shadow-sm">
        <div className="card-body">
          <h2 className="fw-bold mb-2">
            {selectedPetId ? `Appointments for ${selectedPetName || `Pet #${selectedPetId}`}` : "Your Pet Appointments"}
          </h2>
          <p className="text-muted">View previous and upcoming appointments.</p>

          {loading && <div>Loading appointments…</div>}
          {error && <div className="alert alert-danger">{error}</div>}

          {!loading && !error && (
            <>
              {appointments.length === 0 ? (
                <div className="text-muted">No appointments found.</div>
              ) : (
                <div className="row g-3">
                  {appointments.map((a) => (
                    <div key={a.appointmentId} className="col-md-6 col-lg-4">
                      <div className="card h-100 shadow-sm">
                        <div className="card-body">
                          <div className="d-flex justify-content-between mb-2">
                            <h6 className="mb-0">Appointment #{a.appointmentId}</h6>
                            <span className={`badge ${badgeClass(a.status)}`}>{a.status}</span>
                          </div>

                          <p className="mb-1">📅 {formatDateTime(a.slotDate, a.slotStartTime)}</p>
                          <p className="mb-1">🐾 {petMap[a.petId] || "—"}</p>
                          <p className="mb-1">👨‍⚕️ {vetMap[a.vetId] || "—"}</p>
                          <p className="mb-1">🏥 {typeMap[a.appointmentTypeId] || "—"}</p>
                          <p className="mb-0">📱 {a.appointmentMode}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}