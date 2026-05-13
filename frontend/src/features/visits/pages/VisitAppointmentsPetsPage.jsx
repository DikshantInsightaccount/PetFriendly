import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminApi } from "../../admin/adminApi";
 
export default function VetAppointmentsPetsPage() {
  const navigate = useNavigate();
 
  const [vetId, setVetId] = useState(null);
 
  // now appointments already contain petName/type/breed
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [q, setQ] = useState("");
 
  // Get vetId safely
  useEffect(() => {
    const v = Number(localStorage.getItem("vetId"));
    if (v) {
      setVetId(v);
    } else {
      setErr("vetId not found. Please login again.");
      setLoading(false);
    }
  }, []);
 
  // Load appointments WITH pet info (single API call)
  useEffect(() => {
    if (!vetId) return;
 
    const load = async () => {
      setLoading(true);
      setErr("");
 
      try {
        // IMPORTANT: use the new endpoint
        const appts = await adminApi.getAppointmentsByVetWithPet(vetId);
        setAppointments(Array.isArray(appts) ? appts : []);
      } catch (e) {
        const msg =
          e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load appointments";
        setErr(msg);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    };
 
    load();
  }, [vetId]);
 
  // Build unique pet cards from appointments (now petName/type/breed comes from DTO)
  const petCards = useMemo(() => {
    const map = new Map();
 
    for (const a of appointments) {
      const petId = a.petId;
      if (!petId) continue;
 
      if (!map.has(petId)) {
        map.set(petId, {
          petId,
          pet: {
            name: a.petName,
            type: a.petType,
            breed: a.petBreed,
          },
          appts: [],
        });
      }
      map.get(petId).appts.push(a);
    }
 
    // sort appointments per pet
    const cards = [...map.values()].map((c) => ({
      ...c,
      appts: c.appts.sort(
        (x, y) => Number(y.appointmentId) - Number(x.appointmentId)
      ),
    }));
 
    // search
    const query = q.trim().toLowerCase();
    if (!query) return cards;
 
    return cards.filter((c) => {
      const name = (c.pet?.name || "").toLowerCase();
      const type = (c.pet?.type || "").toLowerCase();
      const breed = (c.pet?.breed || "").toLowerCase();
 
      return (
        name.includes(query) ||
        type.includes(query) ||
        breed.includes(query) ||
        String(c.petId).includes(query) ||
        c.appts.some((a) => String(a.appointmentId).includes(query))
      );
    });
  }, [appointments, q]);
 
  if (loading) return <div className="container-fluid mt-3">Loading...</div>;
 
  return (
    <div className="container-fluid mt-3">
      <div className="mb-3">
        <h3 className="fw-bold mb-0">My Pets (From My Appointments)</h3>
        <div className="text-muted small">Click a pet → view visits</div>
        <div className="text-muted small">Vet ID: {vetId || "-"}</div>
      </div>
 
      {err && <div className="alert alert-danger">{err}</div>}
 
      <input
        className="form-control mb-3"
        placeholder="Search pet name / type / breed / petId / appointmentId..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
      />
 
      {petCards.length === 0 ? (
        <div className="text-muted">
          No pets found.
          <div className="small text-muted mt-1">
            (If you are logged in as vetId={vetId}, ensure appointments exist in DB
            with vet_id={vetId}.)
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {petCards.map((c) => {
            const latestAppointmentId = c.appts[0]?.appointmentId;
 
            return (
              <div className="col-12 col-md-6 col-xl-4" key={c.petId}>
                <div
                  className="card shadow-sm h-100"
                  role="button"
                  style={{ cursor: latestAppointmentId ? "pointer" : "not-allowed" }}
                  onClick={() => {
  if (!latestAppointmentId) return;
 
  navigate(`/app/visits/pet/${c.petId}`, {
    state: {
      pet: c.pet,                 // optional (for UI display)
      appointmentId: latestAppointmentId, // important for POST visit
    },
  });
}}
                >
                  <div className="card-body">
                    <div className="fw-bold fs-5">
                      {c.pet?.name || "Unknown Pet"}
                    </div>
 
                    <div className="text-muted small">
                      Pet #{c.petId} • {c.pet?.type || "-"} • {c.pet?.breed || "-"}
                    </div>
 
                    <div className="mt-2">
                      <span className="badge text-bg-light me-2">
                        Appts: {c.appts.length}
                      </span>
                      {latestAppointmentId && (
                        <span className="badge bg-primary">
                          Appointment #{latestAppointmentId}
                        </span>
                      )}
                    </div>
 
                    <div className="text-muted small mt-2">
                      {latestAppointmentId ? "Click to view visits" : "No appointments"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}