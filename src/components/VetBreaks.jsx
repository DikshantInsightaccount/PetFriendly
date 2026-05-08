// src/components/VetBreaks.jsx
import { useEffect, useState } from "react";
import "../styles/home.css";

export default function VetBreaks() {
  const BASE_URL = "http://localhost:8085";

  const [breaks, setBreaks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ✅ keep vet_id as string
  const [form, setForm] = useState({
    vet_id: "",
    name: "",
    start: "",
    end: "",
  });

  /* ---------- helpers ---------- */
  const normalizeTime = (time) =>
    time && time.length === 5 ? `${time}:00` : time;

  // Handles ResponseMessage<T> and also raw JSON
  const unwrap = async (res) => {
    const text = await res.text();
    let json = null;

    try {
      json = text ? JSON.parse(text) : null;
    } catch {}

    if (!res.ok) {
      // If backend returned plain error text, show it
      throw new Error(json?.message || text || `HTTP ${res.status}`);
    }

    // Supports { message, statusCode, data }
    return json?.data ?? json;
  };

  /* ---------- GET breaks ---------- */
  const fetchBreaks = async (vetIdStr) => {
    if (!vetIdStr?.trim()) {
      setBreaks([]);
      return;
    }

    const vetId = Number(vetIdStr);
    if (!vetId) {
      setBreaks([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/vets/${vetId}/breaks`);
      const data = await unwrap(res);

      // Normalize shapes in case backend fields differ
      const normalized = (data || []).map((b) => ({
        id: b.id ?? b.breakId ?? b.vetBreakId ?? b.break_id,
        vet_id: b.vetId ?? b.vet_id ?? vetId,
        name: b.name ?? b.breakName ?? b.break_name ?? "",
        start: b.startTime ?? b.start ?? b.start_time,
        end: b.endTime ?? b.end ?? b.end_time,
      }));

      setBreaks(normalized);
    } catch (e) {
      setError(e.message);
      setBreaks([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- POST add break ---------- */
  const addBreak = async () => {
    if (!form.vet_id || !form.name || !form.start || !form.end) return;

    const vetId = Number(form.vet_id);
    if (!vetId) return;

    setSaving(true);
    setError("");

    // ✅ payload should match your VetBreak fields
    // If your entity uses breakName instead of name, change "name" to "breakName"
    const payload = {
      breakName: form.name,
      startTime: normalizeTime(form.start),
      endTime: normalizeTime(form.end),
    };

    try {
      const res = await fetch(`${BASE_URL}/vets/${vetId}/breaks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await unwrap(res);

      // refresh list after save
      await fetchBreaks(form.vet_id);

      // reset only break fields (keep vet_id)
      setForm((prev) => ({
        ...prev,
        name: "",
        start: "",
        end: "",
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- auto load on vet_id ---------- */
  useEffect(() => {
    fetchBreaks(form.vet_id);
  }, [form.vet_id]);

  /* ---------- UI ---------- */
  return (
    <div className="home-wrapper vet-page">
      <section className="features-section">
        <div className="vet-shell">
          <div className="feature-card vet-card-premium vet-form-card">
            {/* ✨ HEADER */}
            <div className="vet-form-header">
              <div className="vet-kicker">Pet Clinic • Admin</div>
              <h1 className="vet-title">Vet Breaks</h1>
              <p className="vet-subtitle">
                Manage break schedules to avoid appointment conflicts.
              </p>
            </div>

            {/* ✅ FORM */}
            <div className="vet-form-inner">
              {error && <div className="vet-error">{error}</div>}

              <div className="vet-form-grid">
                {/* Vet ID */}
                <div className="vet-field">
                  <label className="vet-label">Vet ID</label>
                  <input
                    className="vet-input"
                    placeholder="Enter Vet ID (e.g. 1)"
                    value={form.vet_id}
                    onChange={(e) =>
                      setForm({ ...form, vet_id: e.target.value })
                    }
                  />
                </div>

                {/* Break Name */}
                <div className="vet-field">
                  <label className="vet-label">Break Name</label>
                  <input
                    className="vet-input"
                    placeholder="Lunch, Tea Break..."
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    disabled={!Number(form.vet_id)}
                  />
                </div>

                {/* Start Time */}
                <div className="vet-field">
                  <label className="vet-label">Start Time</label>
                  <input
                    type="time"
                    className="vet-input"
                    value={form.start}
                    onChange={(e) =>
                      setForm({ ...form, start: e.target.value })
                    }
                    disabled={!Number(form.vet_id)}
                  />
                </div>

                {/* End Time */}
                <div className="vet-field">
                  <label className="vet-label">End Time</label>
                  <input
                    type="time"
                    className="vet-input"
                    value={form.end}
                    onChange={(e) => setForm({ ...form, end: e.target.value })}
                    disabled={!Number(form.vet_id)}
                  />
                </div>
              </div>

              {/* ✅ ACTION */}
              <div className="vet-form-actions">
                <button
                  type="button"
                  className="btn-gradient vet-save-btn"
                  onClick={addBreak}
                  disabled={
                    saving ||
                    !Number(form.vet_id) ||
                    !form.name ||
                    !form.start ||
                    !form.end
                  }
                >
                  {saving ? "Saving..." : "Add Break"}
                </button>
              </div>
            </div>

            {/* 🧾 TABLE */}
            <div className="vet-table-card">
              <div className="vet-table-top">
                <div className="vet-table-meta">
                  <span className="vet-pill">
                    Total Breaks: {breaks.length}
                  </span>
                  <span className="vet-dot" />
                  <span className="vet-muted">Scheduled veterinarian breaks</span>
                </div>
              </div>

              <div className="vet-table-wrap">
                <table className="vet-table-premium">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Vet ID</th>
                      <th>Break</th>
                      <th>Start</th>
                      <th>End</th>
                    </tr>
                  </thead>

                  <tbody>
                    {breaks.map((b) => (
                      <tr key={b.id ?? `${b.vet_id}-${b.name}-${b.start}`}>
                        <td>{b.id ?? "-"}</td>
                        <td>{b.vet_id}</td>
                        <td>{b.name}</td>
                        <td>{String(b.start).slice(0, 5)}</td>
                        <td>{String(b.end).slice(0, 5)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!loading && breaks.length === 0 && (
                  <div className="empty-state-premium">
                    <div className="empty-emoji">☕</div>
                    <div className="empty-title">No breaks found</div>
                    <div className="empty-sub">
                      Enter a Vet ID to load breaks, or add a new break.
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="empty-state-premium">
                    <div className="empty-title">Loading breaks...</div>
                  </div>
                )}
              </div>
            </div>

            {/* ✨ FOOTER NOTE */}
            <div className="vet-footer-note">
              Spring Boot + LocalTime ✅ (Breaks endpoint)
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}