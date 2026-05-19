import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { adminApi } from "../../admin/adminApi";
 
export default function VisitsPage() {
  const navigate = useNavigate();
  const { petId: petIdParam } = useParams();
  const { state } = useLocation();
 
  const petId = Number(petIdParam);
  const pet = state?.pet; // optional: {name,type,breed}
  const defaultAppointmentId = state?.appointmentId ? Number(state.appointmentId) : null;
 
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
 
  // Form state (new visit)
  const [appointmentId, setAppointmentId] = useState(defaultAppointmentId || "");
  const [diagnosis, setDiagnosis] = useState("");
  const [treatment, setTreatment] = useState("");
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
 
  // Load visits by petId
  useEffect(() => {
    if (!petId) {
      setErr("petId missing. Please go back and select a pet again.");
      setLoading(false);
      return;
    }
 
    const load = async () => {
      setLoading(true);
      setErr("");
      try {
        const data = await adminApi.getVisitsByPetAdmin(petId);
        setVisits(Array.isArray(data) ? data : []);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load visits";
        setErr(msg);
        setVisits([]);
      } finally {
        setLoading(false);
      }
    };
 
    load();
  }, [petId]);
 
  const sortedVisits = useMemo(() => {
    return [...visits].sort((a, b) => Number(b.visitId) - Number(a.visitId));
  }, [visits]);
 
  // Create visit for this pet
  const handleCreateVisit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setErr("");
 
    const apptIdNum = Number(appointmentId);
    if (!apptIdNum) {
      setErr("Appointment ID is required (must be a number).");
      return;
    }
 
    if (!diagnosis.trim() && !treatment.trim() && !prescription.trim() && !notes.trim()) {
      setErr("Please fill at least one field (diagnosis/treatment/prescription/notes).");
      return;
    }
 
    const payload = {
      appointmentId: apptIdNum,
      petId: petId,
      diagnosis: diagnosis.trim() || null,
      treatment: treatment.trim() || null,
      prescription: prescription.trim() || null,
      notes: notes.trim() || null,
    };
 
    try {
      setSaving(true);
      const created = await adminApi.createVisitAdmin(payload);
 
      // Optimistic update
      setVisits((prev) => [created, ...prev]);
 
      // Clear form
      setDiagnosis("");
      setTreatment("");
      setPrescription("");
      setNotes("");
 
      setSuccess("Visit added successfully ✅");
    } catch (e2) {
      const msg =
        e2?.response?.data?.message ||
        e2?.response?.data?.error ||
        e2?.message ||
        "Failed to create visit";
      setErr(msg);
    } finally {
      setSaving(false);
    }
  };
 
  if (loading) return <div className="container-fluid mt-3">Loading visits...</div>;
 
  return (
    <div className="container-fluid mt-3">
      <div className="d-flex align-items-center justify-content-between mb-3">
        <div>
          <h3 className="fw-bold mb-0">Visits</h3>
          <div className="text-muted small">
            Pet #{petId}
            {pet?.name ? ` • ${pet.name}` : ""}
            {pet?.type ? ` • ${pet.type}` : ""}
            {pet?.breed ? ` • ${pet.breed}` : ""}
          </div>
        </div>
 
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>
 
      {err && <div className="alert alert-danger">{err}</div>}
      {success && <div className="alert alert-success">{success}</div>}
 
      {/* Add Visit Form */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h5 className="fw-bold mb-3">Add New Visit</h5>
 
          <form onSubmit={handleCreateVisit} className="row g-3">
            <div className="col-12 col-md-4">
              <label className="form-label">Appointment ID</label>
              <input
                className="form-control"
                value={appointmentId}
                onChange={(e) => setAppointmentId(e.target.value)}
                placeholder="e.g. 1"
                inputMode="numeric"
              />
              <div className="text-muted small mt-1">
                (This visit must be linked to an appointment.)
              </div>
            </div>
 
            <div className="col-12 col-md-8" />
 
            <div className="col-12 col-md-6">
              <label className="form-label">Diagnosis</label>
              <input
                className="form-control"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g. Fever"
              />
            </div>
 
            <div className="col-12 col-md-6">
              <label className="form-label">Treatment</label>
              <input
                className="form-control"
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                placeholder="e.g. Medication"
              />
            </div>
 
            <div className="col-12 col-md-6">
              <label className="form-label">Prescription</label>
              <input
                className="form-control"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="e.g. Paracetamol"
              />
            </div>
 
            <div className="col-12 col-md-6">
              <label className="form-label">Notes</label>
              <input
                className="form-control"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Follow-up in 3 days"
              />
            </div>
 
            <div className="col-12 d-flex gap-2">
              <button className="btn btn-primary" disabled={saving}>
                {saving ? "Saving..." : "Add Visit"}
              </button>
              <button
                type="button"
                className="btn btn-light"
                onClick={() => {
                  setDiagnosis("");
                  setTreatment("");
                  setPrescription("");
                  setNotes("");
                  setSuccess("");
                  setErr("");
                }}
              >
                Clear
              </button>
            </div>
          </form>
        </div>
      </div>
 
      {/*  Visits list */}
      {sortedVisits.length === 0 ? (
        <div className="text-muted">No visits found for this pet.</div>
      ) : (
        <div className="row g-3">
          {sortedVisits.map((v) => (
            <div className="col-12 col-md-6 col-xl-4" key={v.visitId}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <div className="fw-bold fs-5">Visit #{v.visitId}</div>
 
                  <div className="text-muted small">
                    Appointment #{v.appointmentId} • Pet #{v.petId}
                  </div>
 
                  <hr />
 
                  <div className="mb-2">
                    <div className="fw-semibold">Diagnosis</div>
                    <div className="text-muted">{v.diagnosis || "-"}</div>
                  </div>
 
                  <div className="mb-2">
                    <div className="fw-semibold">Treatment</div>
                    <div className="text-muted">{v.treatment || "-"}</div>
                  </div>
 
                  <div className="mb-2">
                    <div className="fw-semibold">Prescription</div>
                    <div className="text-muted">{v.prescription || "-"}</div>
                  </div>
 
                  <div className="mb-0">
                    <div className="fw-semibold">Notes</div>
                    <div className="text-muted">{v.notes || "-"}</div>
                  </div>
 
                  {(v.createdAt || v.updatedAt) && (
                    <div className="text-muted small mt-3">
                      {v.createdAt ? `Created: ${v.createdAt}` : ""}
                      {v.updatedAt ? ` • Updated: ${v.updatedAt}` : ""}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
 