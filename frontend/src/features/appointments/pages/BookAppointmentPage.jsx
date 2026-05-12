import { useEffect, useMemo, useState } from "react";
import { petsApi } from "../../../api/modules/pets.api";
import { vetsApi } from "../../../api/modules/vets.api";
import { slotsApi } from "../../../api/modules/slots.api";
import { appointmentsApi } from "../../../api/modules/appointments.api";

import "../../../styles/home.css";

const STEPS = ["Service", "Time", "Details", "Done"];

export default function BookAppointmentPage() {
  const [step, setStep] = useState(0);

  const [pets, setPets] = useState([]);
  const [types, setTypes] = useState([]);
  const [vets, setVets] = useState([]);
  const [slots, setSlots] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // selections
  const [petId, setPetId] = useState("");
  const [appointmentTypeId, setAppointmentTypeId] = useState("");
  const [appointmentTypeName, setAppointmentTypeName] = useState(""); // for vet filter
  const [vetId, setVetId] = useState("");
  const [mode, setMode] = useState("OFFLINE");

  // time filters
  const todayISO = new Date().toISOString().slice(0, 10);
  const [fromDate, setFromDate] = useState(todayISO);
  const [toDate, setToDate] = useState(todayISO);

  // chosen slot
  const [slotId, setSlotId] = useState("");
  const [booked, setBooked] = useState(null);

  // --- initial load (pets + appointment types) ---
  useEffect(() => {
    (async () => {
      setLoading(true);
      setError("");
      try {
        const [petsData, typeData] = await Promise.all([
          petsApi.getMyPets(),
          vetsApi.getAppointmentTypes(),
        ]);
        setPets(Array.isArray(petsData) ? petsData : []);
        setTypes(Array.isArray(typeData) ? typeData : []);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "Failed to load booking data");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // --- when appointment type changes -> load vets for that speciality ---
  useEffect(() => {
    if (!appointmentTypeName) {
      setVets([]);
      setVetId("");
      return;
    }

    (async () => {
      setLoading(true);
      setError("");
      try {
        const vetData = await vetsApi.getVetsBySpeciality(appointmentTypeName);
        setVets(Array.isArray(vetData) ? vetData : []);
      } catch (e) {
        setError(e?.response?.data?.message || e?.message || "Failed to load vets");
      } finally {
        setLoading(false);
      }
    })();
  }, [appointmentTypeName]);

  // --- load slots (Step 2) ---
  const loadSlots = async () => {
    if (!vetId || !fromDate || !toDate) return;
    setLoading(true);
    setError("");
    try {
      const data = await slotsApi.getAvailableSlots(vetId, fromDate, toDate);
      setSlots(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(
        e?.response?.data?.message ||
          e?.message ||
          "Failed to load available slots. Check SLOT endpoint mapping in ENDPOINTS."
      );
    } finally {
      setLoading(false);
    }
  };

  const canGoStep1 = petId && appointmentTypeId && vetId && mode;
  const canGoStep2 = slotId;

  const selectedType = useMemo(
    () => types.find((t) => String(t.appointmentTypeId ?? t.id) === String(appointmentTypeId)),
    [types, appointmentTypeId]
  );

  // --- booking ---
  const bookNow = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        petId: Number(petId),
        vetId: Number(vetId),
        appointmentTypeId: Number(appointmentTypeId),
        slotId: Number(slotId),
        appointmentMode: mode,
      };

      const res = await appointmentsApi.book(payload);
      setBooked(res);
      setStep(3);
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-wrapper">
      <div className="home-content">
        <div className="container py-4">
          <div className="feature-card vet-card-premium">
            {/* Stepper */}
            <div className="d-flex justify-content-between mb-3" style={{ gap: 8 }}>
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className="text-center"
                  style={{
                    flex: 1,
                    padding: "10px 8px",
                    borderRadius: 10,
                    background: i === step ? "rgba(79,107,220,0.15)" : "rgba(15,23,42,0.04)",
                    fontWeight: i === step ? 800 : 600,
                    color: i === step ? "#1d4ed8" : "#334155",
                  }}
                >
                  {i + 1}. {s}
                </div>
              ))}
            </div>

            {error && <div className="alert alert-danger">{error}</div>}
            {loading && <div className="text-muted">Loading…</div>}

            {/* STEP 1: Service */}
            {step === 0 && (
              <>
                <h4 className="fw-bold mb-3">Select service</h4>

                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Pet</label>
                    <select className="form-select" value={petId} onChange={(e) => setPetId(e.target.value)}>
                      <option value="">Select pet</option>
                      {pets.map((p) => (
                        <option key={p.petId ?? p.id} value={p.petId ?? p.id}>
                          {p.name} ({p.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Service (Appointment Type)</label>
                    <select
                      className="form-select"
                      value={appointmentTypeId}
                      onChange={(e) => {
                        const id = e.target.value;
                        setAppointmentTypeId(id);
                        const t = types.find((x) => String(x.appointmentTypeId ?? x.id) === String(id));
                        setAppointmentTypeName(t?.name ?? "");
                        setVetId("");
                        setSlots([]);
                        setSlotId("");
                      }}
                    >
                      <option value="">Select service</option>
                      {types.map((t) => (
                        <option key={t.appointmentTypeId ?? t.id} value={t.appointmentTypeId ?? t.id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Vet</label>
                    <select
                      className="form-select"
                      value={vetId}
                      onChange={(e) => {
                        setVetId(e.target.value);
                        setSlots([]);
                        setSlotId("");
                      }}
                      disabled={!appointmentTypeName}
                    >
                      <option value="">{appointmentTypeName ? "Select vet" : "Select service first"}</option>
                      {vets.map((v) => (
                        <option key={v.vetId ?? v.id} value={v.vetId ?? v.id}>
                          Vet #{v.vetId ?? v.id}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Mode</label>
                    <select className="form-select" value={mode} onChange={(e) => setMode(e.target.value)}>
                      <option value="OFFLINE">OFFLINE</option>
                      <option value="ONLINE">ONLINE</option>
                    </select>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button
                    className="btn btn-primary"
                    disabled={!canGoStep1}
                    onClick={() => setStep(1)}
                  >
                    Next
                  </button>
                </div>
              </>
            )}

            {/* STEP 2: Time */}
            {step === 1 && (
              <>
                <h4 className="fw-bold mb-2">Select a time slot</h4>
                <div className="text-muted mb-3">
                  {selectedType?.name ? `Service: ${selectedType.name}` : ""}
                </div>

                <div className="row g-3 align-items-end">
                  <div className="col-md-3">
                    <label className="form-label">From</label>
                    <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <label className="form-label">To</label>
                    <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                  </div>
                  <div className="col-md-3">
                    <button className="btn btn-outline-primary w-100" onClick={loadSlots} disabled={!vetId}>
                      Load Slots
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  {slots.length === 0 ? (
                    <div className="text-muted">No slots loaded yet.</div>
                  ) : (
                    <div className="row g-2">
                      {slots.map((s) => {
                        const id = s.slotId ?? s.id;
                        const label = `${s.slotDate ?? s.date} ${s.startTime ?? s.slotStartTime ?? ""}-${s.endTime ?? s.slotEndTime ?? ""}`;
                        const available = s.isAvailable ?? s.available ?? true;

                        return (
                          <div key={id} className="col-md-3">
                            <button
                              type="button"
                              className={`btn w-100 ${String(slotId) === String(id) ? "btn-primary" : "btn-outline-secondary"}`}
                              disabled={!available}
                              onClick={() => setSlotId(String(id))}
                            >
                              {label}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button className="btn btn-outline-secondary" onClick={() => setStep(0)}>
                    Back
                  </button>
                  <button className="btn btn-primary" disabled={!canGoStep2} onClick={() => setStep(2)}>
                    Next
                  </button>
                </div>
              </>
            )}

            {/* STEP 3: Details (confirmation) */}
            {step === 2 && (
              <>
                <h4 className="fw-bold mb-3">Confirm booking</h4>

                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="text-uppercase text-muted small">Pet</div>
                    <div className="fw-semibold">{pets.find((p) => String(p.petId ?? p.id) === String(petId))?.name ?? "-"}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="text-uppercase text-muted small">Service</div>
                    <div className="fw-semibold">{appointmentTypeName || "-"}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="text-uppercase text-muted small">Vet</div>
                    <div className="fw-semibold">Vet #{vetId}</div>
                  </div>
                  <div className="col-md-6">
                    <div className="text-uppercase text-muted small">Mode</div>
                    <div className="fw-semibold">{mode}</div>
                  </div>
                  <div className="col-md-12">
                    <div className="text-uppercase text-muted small">Slot</div>
                    <div className="fw-semibold">Slot #{slotId}</div>
                  </div>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button className="btn btn-outline-secondary" onClick={() => setStep(1)}>
                    Back
                  </button>
                  <button className="btn btn-success" onClick={bookNow} disabled={loading}>
                    Book Appointment
                  </button>
                </div>
              </>
            )}

            {/* STEP 4: Done */}
            {step === 3 && (
              <>
                <h4 className="fw-bold mb-2">Booked ✅</h4>
                <div className="text-muted mb-3">Your appointment is confirmed.</div>

                <div className="card">
                  <div className="card-body">
                    <div><strong>Appointment ID:</strong> {booked?.appointmentId ?? booked?.id}</div>
                    <div><strong>Status:</strong> {booked?.status}</div>
                    <div><strong>Slot:</strong> {booked?.slotDate} {booked?.slotStartTime}-{booked?.slotEndTime}</div>
                  </div>
                </div>

                <div className="d-flex justify-content-end mt-4">
                  <button className="btn btn-primary" onClick={() => window.location.href = "/app/pets"}>
                    Back to Pets
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
