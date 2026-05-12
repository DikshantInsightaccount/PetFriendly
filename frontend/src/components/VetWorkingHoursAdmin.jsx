// src/components/VetWorkingHours.jsx
import { useEffect, useMemo, useState } from "react";
import "../styles/home.css";
import { api } from "../api/axios";

/**
 * Uses:
 *  GET  /vets/{vetId}/working-hours
 *  POST /vets/{vetId}/working-hours
 */
export default function VetWorkingHoursAdmin() {
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    vet_id: "",
    day: "",
    start: "",
    end: "",
  });

  /* ---------- helpers ---------- */
  const normalizeTime = (time) => (time && time.length === 5 ? `${time}:00` : time);

  const unwrap = (payload) => {
    if (payload && typeof payload === "object" && "data" in payload) return payload.data;
    return payload;
  };

  const errorMessage = (e) =>
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    "Request failed";

  const vetId = useMemo(() => Number(form.vet_id) || 0, [form.vet_id]);
  const canSubmit = vetId > 0 && form.day && form.start && form.end;

  /* ---------- GET working hours ---------- */
  const fetchHours = async (id) => {
    if (!id) {
      setHours([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.get(`/vets/${id}/working-hours`);
      const data = unwrap(res.data);

      const normalized = (data || []).map((h) => ({
        working_hour_id: h.id ?? h.workingHourId ?? h.working_hour_id,
        vet_id: h.vetId ?? h.vet_id ?? id,
        day: h.dayOfWeek ?? h.day,
        start: h.startTime ?? h.start,
        end: h.endTime ?? h.end,
      }));

      setHours(normalized);
    } catch (e) {
      setError(errorMessage(e));
      setHours([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- POST add working hour ---------- */
  const addHours = async () => {
    if (!canSubmit) return;

    if (form.end <= form.start) {
      setError("End time must be after start time.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      dayOfWeek: form.day,
      startTime: normalizeTime(form.start),
      endTime: normalizeTime(form.end),
    };

    try {
      await api.post(`/vets/${vetId}/working-hours`, payload);
      await fetchHours(vetId);
      setForm((prev) => ({ ...prev, day: "", start: "", end: "" }));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchHours(vetId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vetId]);

  return (
    <div className="home-wrapper vet-page">
      <section className="features-section">
        <div className="vet-shell">
          <div className="feature-card vet-card-premium vet-form-card">
            <div className="vet-form-header">
              <div className="vet-kicker">Pet Clinic • Vet</div>
              <h1 className="vet-title">Vet Working Hours</h1>
              <p className="vet-subtitle">Define weekly availability for veterinarians.</p>
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
                    onChange={(e) => setForm({ ...form, vet_id: e.target.value })}
                  />
                </div>

                <div className="vet-field">
                  <label className="vet-label">Day</label>
                  <select
                    className="vet-input vet-select"
                    value={form.day}
                    onChange={(e) => setForm({ ...form, day: e.target.value })}
                    disabled={!vetId}
                  >
                    <option value="">Select Day</option>
                    <option value="MON">MON</option>
                    <option value="TUE">TUE</option>
                    <option value="WED">WED</option>
                    <option value="THU">THU</option>
                    <option value="FRI">FRI</option>
                    <option value="SAT">SAT</option>
                    <option value="SUN">SUN</option>
                  </select>
                </div>

                <div className="vet-field">
                  <label className="vet-label">Start Time</label>
                  <input
                    type="time"
                    className="vet-input"
                    value={form.start}
                    onChange={(e) => setForm({ ...form, start: e.target.value })}
                    disabled={!vetId}
                  />
                </div>

                <div className="vet-field">
                  <label className="vet-label">End Time</label>
                  <input
                    type="time"
                    className="vet-input"
                    value={form.end}
                    onChange={(e) => setForm({ ...form, end: e.target.value })}
                    disabled={!vetId}
                  />
                </div>
              </div>

              <div className="vet-form-actions">
                <button
                  type="button"
                  className="btn-gradient vet-save-btn"
                  onClick={addHours}
                  disabled={saving || !canSubmit}
                >
                  {saving ? "Saving..." : "Add Working Hours"}
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
                      <th>Day</th>
                      <th>Start</th>
                      <th>End</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hours.map((h) => (
                      <tr key={h.working_hour_id ?? `${h.vet_id}-${h.day}-${h.start}`}>
                        <td>{h.working_hour_id ?? "-"}</td>
                        <td>{h.vet_id}</td>
                        <td>{h.day}</td>
                        <td>{String(h.start).slice(0, 5)}</td>
                        <td>{String(h.end).slice(0, 5)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!loading && hours.length === 0 && (
                  <div className="empty-state-premium">No working hours found</div>
                )}
                {loading && (
                  <div className="empty-state-premium">Loading working hours…</div>
                )}
              </div>
            </div>

            <div className="vet-footer-note">Uses axios + gateway auth ✅</div>
          </div>
        </div>
      </section>
    </div>
  );
}