// src/components/VetBreaks.jsx

import { useEffect, useState } from "react";
import "../styles/home.css";
import { api } from "../api/axios"; // ✅ CORRECT IMPORT

/**
 * ENDPOINTS USED:
 *  GET  /vets/{vetId}/breaks
 *  POST /vets/{vetId}/breaks
 *
 * axios instance handles baseURL + Authorization
 */
export default function VetBreaks() {
  const [breaks, setBreaks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    vet_id: "",
    name: "",
    start: "",
    end: "",
  });

  /* ---------- helpers ---------- */

  const normalizeTime = (time) =>
    time && time.length === 5 ? `${time}:00` : time;

  const unwrap = (payload) =>
    payload && typeof payload === "object" && "data" in payload
      ? payload.data
      : payload;

  const errorMessage = (e) =>
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    "Request failed";

  /* ---------- API calls ---------- */

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
      const res = await api.get(`/vets/${vetId}/breaks`);
      const data = unwrap(res.data);

      const normalized = (data || []).map((b) => ({
        id: b.id ?? b.breakId ?? b.vetBreakId ?? b.break_id,
        vet_id: b.vetId ?? b.vet_id ?? vetId,
        name: b.name ?? b.breakName ?? b.break_name ?? "",
        start: b.startTime ?? b.start ?? b.start_time ?? "",
        end: b.endTime ?? b.end ?? b.end_time ?? "",
      }));

      setBreaks(normalized);
    } catch (e) {
      setError(errorMessage(e));
      setBreaks([]);
    } finally {
      setLoading(false);
    }
  };

  const addBreak = async () => {
    if (!form.vet_id || !form.name || !form.start || !form.end) return;

    const vetId = Number(form.vet_id);
    if (!vetId) return;

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
      await api.post(`/vets/${vetId}/breaks`, payload);
      await fetchBreaks(form.vet_id);

      setForm((prev) => ({
        ...prev,
        name: "",
        start: "",
        end: "",
      }));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  /* ---------- effects ---------- */

  useEffect(() => {
    fetchBreaks(form.vet_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.vet_id]);

  /* ---------- UI ---------- */

  return (
    <div className="home-wrapper vet-page">
      <section className="features-section">
        <div className="vet-shell">
          <div className="feature-card vet-card-premium vet-form-card">
            <div className="vet-form-header">
              <div className="vet-kicker">Pet Clinic • Vet</div>
              <h1 className="vet-title">Vet Breaks</h1>
              <p className="vet-subtitle">
                Manage break schedules to avoid appointment conflicts.
              </p>
            </div>

            <div className="vet-form-inner">
              {error && <div className="vet-error">{error}</div>}

              <div className="vet-form-grid">
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

                <div className="vet-field">
                  <label className="vet-label">Break Name</label>
                  <input
                    className="vet-input"
                    placeholder="Lunch, Tea Break..."
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    disabled={!Number(form.vet_id)}
                  />
                </div>

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

                <div className="vet-field">
                  <label className="vet-label">End Time</label>
                  <input
                    type="time"
                    className="vet-input"
                    value={form.end}
                    onChange={(e) =>
                      setForm({ ...form, end: e.target.value })
                    }
                    disabled={!Number(form.vet_id)}
                  />
                </div>
              </div>

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

            <div className="vet-table-card">
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
                      <tr
                        key={b.id ?? `${b.vet_id}-${b.name}-${b.start}`}
                      >
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
                    <div className="empty-title">
                      Loading breaks...
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="vet-footer-note">
              Uses axios + gateway auth ✅
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}