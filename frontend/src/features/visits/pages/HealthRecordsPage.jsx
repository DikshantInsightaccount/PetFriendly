import { useEffect, useMemo, useState } from "react";
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";
import { petsApi } from "../../../api/modules/pets.api";

import "../../../styles/health-records.css";

export default function HealthRecordsPage() {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(null);

  const [visitsByPet, setVisitsByPet] = useState({}); // petId -> visits[]
  const [loading, setLoading] = useState(true);
  const [loadingPet, setLoadingPet] = useState(false);
  const [error, setError] = useState("");

  // 1) Load my pets once
  useEffect(() => {
    let alive = true;

    (async () => {
      setLoading(true);
      setError("");
      try {
        const petsData = await petsApi.getMyPets();
        const list = Array.isArray(petsData) ? petsData : [];
        if (!alive) return;

        setPets(list);

        // auto-select first pet
        if (list.length > 0) {
          const pid = list[0].petId ?? list[0].id ?? list[0].pet_id;
          setSelectedPetId(String(pid));
        }
      } catch (e) {
        if (!alive) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load pets");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // 2) When a pet is selected, load its health history
  useEffect(() => {
    if (!selectedPetId) return;

    let alive = true;

    (async () => {
      setLoadingPet(true);
      setError("");

      try {
        // 2a) get appointments for this pet
        const resAppts = await api.get(ENDPOINTS.APPOINTMENTS.BY_PET(selectedPetId));
        const appts = resAppts.data?.data ?? resAppts.data;
        const apptArr = Array.isArray(appts) ? appts : [];

        const appointmentIds = apptArr
          .map((a) => String(a?.appointmentId ?? a?.id ?? a?.appointment_id ?? ""))
          .filter(Boolean);

        if (!alive) return;

        // 2b) fetch visit for each appointment (unique per appointment)
        const results = await Promise.allSettled(
          appointmentIds.map((id) => api.get(ENDPOINTS.VISITS.BY_APPOINTMENT(id)))
        );

        const visits = results
          .filter((r) => r.status === "fulfilled")
          .map((r) => r.value.data?.data ?? r.value.data)
          .filter(Boolean);

        // sort by createdAt/updatedAt desc
        visits.sort((a, b) => {
          const da =
            new Date(a?.createdAt ?? a?.created_at ?? a?.updatedAt ?? a?.updated_at ?? 0).getTime() || 0;
          const db =
            new Date(b?.createdAt ?? b?.created_at ?? b?.updatedAt ?? b?.updated_at ?? 0).getTime() || 0;
          return db - da;
        });

        if (!alive) return;

        setVisitsByPet((prev) => ({
          ...prev,
          [selectedPetId]: visits,
        }));
      } catch (e) {
        if (!alive) return;
        setError(e?.response?.data?.message || e?.message || "Failed to load health history");
      } finally {
        if (!alive) return;
        setLoadingPet(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [selectedPetId]);

  const selectedPet = useMemo(() => {
    return pets.find((p) => String(p.petId ?? p.id ?? p.pet_id) === String(selectedPetId));
  }, [pets, selectedPetId]);

  const visits = visitsByPet[selectedPetId] || [];

  if (loading) {
    return <div className="text-muted">Loading health records…</div>;
  }

  return (
    <div className="health-page">
      <div className="health-header">
        <div>
          <h2 className="health-title">🩺 Health Records</h2>
          <div className="health-subtitle">
            View diagnosis, treatment, prescriptions and notes of your pets!
          </div>
        </div>

        <button
          className="btn btn-outline-primary"
          onClick={() => selectedPetId && setSelectedPetId(String(selectedPetId))}
          disabled={!selectedPetId || loadingPet}
        >
          Refresh
        </button>
      </div>

      {error && <div className="alert alert-danger mt-3">{error}</div>}

      <div className="health-grid">
        {/* LEFT: pet selector */}
        <div className="health-left">
          <div className="health-panel">
            <div className="health-panel-title">Your Pets</div>

            {pets.length === 0 ? (
              <div className="text-muted">No pets found.</div>
            ) : (
              <div className="pet-list">
                {pets.map((p) => {
                  const pid = String(p.petId ?? p.id ?? p.pet_id);
                  const active = String(pid) === String(selectedPetId);

                  return (
                    <button
                      key={pid}
                      className={`pet-pill ${active ? "active" : ""}`}
                      onClick={() => setSelectedPetId(pid)}
                      type="button"
                    >
                      <div className="pet-pill-name">{p.name}</div>
                      <div className="pet-pill-sub">{p.type} {p.breed ? `• ${p.breed}` : ""}</div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: health history */}
        <div className="health-right">
          <div className="health-panel">
            <div className="health-panel-title">
              {selectedPet ? `${selectedPet.name}'s History` : "History"}
            </div>

            {loadingPet ? (
              <div className="text-muted">Loading records…</div>
            ) : visits.length === 0 ? (
              <div className="empty-state">
                No visits recorded yet for this pet.
              </div>
            ) : (
              <div className="visit-list">
                {visits.map((v, idx) => {
                  const visitDate =
                    v?.created_at ||
                    v?.createdAt ||
                    v?.updated_at ||
                    v?.updatedAt ||
                    null;

                  const formattedDate = visitDate
                    ? new Date(visitDate).toLocaleString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Date unknown";

                  const apptNo = v?.appointmentId ?? v?.appointment_id ?? "—";

                  return (
                    <div key={v?.visitId ?? v?.id ?? idx} className="visit-card">
                      <div className="visit-top">
                        <div>
                          <div className="visit-title">Appointment ID: <span className="mono">{apptNo}</span></div>
                          <div className="visit-date">{formattedDate}</div>
                        </div>
                        <span className="badge bg-success">Completed</span>
                      </div>

                      <div className="visit-grid">
                        <div>
                          <div className="visit-label">Diagnosis</div>
                          <div className="visit-value">{v?.diagnosis || "—"}</div>
                        </div>

                        <div>
                          <div className="visit-label">Prescription</div>
                          <div className="visit-value">{v?.prescription || "—"}</div>
                        </div>

                        <div>
                          <div className="visit-label">Treatment</div>
                          <div className="visit-value">{v?.treatment || "—"}</div>
                        </div>

                        <div>
                          <div className="visit-label">Notes</div>
                          <div className="visit-value">{v?.notes || "—"}</div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}