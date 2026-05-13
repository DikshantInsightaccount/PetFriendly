import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../features/vets/components/VetBreaks.css";
import { adminApi } from "../features/admin/adminApi";
 
export default function VetBreaksDetails() {
  const { vetId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
 
  const vetIdNum = useMemo(() => Number(vetId), [vetId]);
 
  const [vet, setVet] = useState(location.state?.vet || null);
  const [breaks, setBreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
 
  const [form, setForm] = useState({ name: "", start: "", end: "" });
  const [error, setError] = useState("");
 
  const errorMessage = (e) =>
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    "Request failed";
 
  const normalizeTime = (time) =>
    time && time.length === 5 ? `${time}:00` : time;
 
  // Load vet summary if page refreshed (state lost)
  const fetchVetIfNeeded = async () => {
    if (vet) return;
    try {
      const list = await adminApi.getVetSummaries();
      const found = (list || []).find((x) => Number(x.vetId) === vetIdNum);
      setVet(found || null);
    } catch {
      // even if it fails, still allow breaks operations
      setVet(null);
    }
  };
 
  const fetchBreaks = async () => {
    if (!vetIdNum) return;
 
    setLoading(true);
    setError("");
    try {
      const data = await adminApi.getVetBreaks(vetIdNum);
 
      const normalized = (data || []).map((b) => ({
        id: b.id ?? b.breakId ?? b.vetBreakId ?? b.break_id,
        breakName: b.breakName ?? b.name ?? b.break_name ?? "",
        startTime: b.startTime ?? b.start ?? b.start_time ?? "",
        endTime: b.endTime ?? b.end ?? b.end_time ?? "",
      }));
 
      setBreaks(normalized);
    } catch (e) {
      setError(errorMessage(e));
      setBreaks([]);
    } finally {
      setLoading(false);
    }
  };
 
  useEffect(() => {
    fetchVetIfNeeded();
    fetchBreaks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vetIdNum]);
 
  const addBreak = async () => {
    if (!form?.name || !form?.start || !form?.end) return;
 
    if (form.end <= form.start) {
      setError("End time must be after start time.");
      return;
    }
 
    setSaving(true);
    setError("");
 
    const payload = {
      breakName: form.name,
      startTime: normalizeTime(form.start),
      endTime: normalizeTime(form.end),
    };
 
    try {
      await adminApi.addVetBreak(vetIdNum, payload);
      setForm({ name: "", start: "", end: "" });
      await fetchBreaks();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };
 
  return (
    <div className="home-wrapper vet-page">
      <section className="features-section">
        <div className="vet-shell wide-shell">
          <div className="feature-card vet-card-premium vet-form-card wide-card">
            <div className="details-topbar">
              <button className="btn-outline" onClick={() => navigate(-1)}>
                ← Back
              </button>
 
              <button className="btn-outline" onClick={fetchBreaks} disabled={loading}>
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
 
            <div className="vet-form-header">
              <div className="vet-kicker">Pet Clinic • Admin</div>
              <h1 className="vet-title">Vet Break Details</h1>
              <p className="vet-subtitle">
                Manage break timings for selected vet.
              </p>
            </div>
 
            {error && <div className="vet-error">{error}</div>}
 
            {/* Vet summary */}
            <div className="details-grid">
              <div className="details-card">
                <div className="section-title">Vet Info</div>
 
                <div className="info-row">
                  <div className="info-label">Vet ID</div>
                  <div className="info-value">{vetIdNum}</div>
                </div>
 
                <div className="info-row">
                  <div className="info-label">Name</div>
                  <div className="info-value">{vet?.name || "—"}</div>
                </div>
 
                <div className="info-row">
                  <div className="info-label">Email</div>
                  <div className="info-value">{vet?.email || "—"}</div>
                </div>
 
                <div className="info-row">
                  <div className="info-label">User ID</div>
                  <div className="info-value">{vet?.userId || "—"}</div>
                </div>
              </div>
 
              {/* Add break */}
              <div className="details-card">
                <div className="section-title">Add New Break</div>
 
                <div className="vet-form-grid">
                  <div className="vet-field">
                    <label className="vet-label">Break Name</label>
                    <input
                      className="vet-input"
                      placeholder="Lunch, Tea Break..."
                      value={form.name}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, name: e.target.value }))
                      }
                    />
                  </div>
 
                  <div className="vet-field">
                    <label className="vet-label">Start Time</label>
                    <input
                      type="time"
                      className="vet-input"
                      value={form.start}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, start: e.target.value }))
                      }
                    />
                  </div>
 
                  <div className="vet-field">
                    <label className="vet-label">End Time</label>
                    <input
                      type="time"
                      className="vet-input"
                      value={form.end}
                      onChange={(e) =>
                        setForm((p) => ({ ...p, end: e.target.value }))
                      }
                    />
                  </div>
                </div>
 
                <div className="vet-form-actions">
                  <button
                    className="btn-gradient vet-save-btn"
                    onClick={addBreak}
                    disabled={saving || !form.name || !form.start || !form.end}
                  >
                    {saving ? "Saving..." : "Add Break"}
                  </button>
 
                  <button
                    className="btn-outline"
                    onClick={() => setForm({ name: "", start: "", end: "" })}
                    disabled={saving}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
 
            {/* Breaks table */}
            <div className="details-card full">
              <div className="section-title">Breaks</div>
 
              {loading ? (
                <div className="empty-state-premium">
                  <div className="empty-title">Loading breaks...</div>
                </div>
              ) : breaks.length === 0 ? (
                <div className="empty-state-premium">
                  <div className="empty-emoji">☕</div>
                  <div className="empty-title">No breaks yet</div>
                  <div className="empty-sub">Add one above.</div>
                </div>
              ) : (
                <table className="vet-table-premium">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Break</th>
                      <th>Start</th>
                      <th>End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breaks.map((b) => (
                      <tr key={b.id ?? `${b.breakName}-${b.startTime}`}>
                        <td>{b.id ?? "-"}</td>
                        <td>{b.breakName}</td>
                        <td>{String(b.startTime).slice(0, 5)}</td>
                        <td>{String(b.endTime).slice(0, 5)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}