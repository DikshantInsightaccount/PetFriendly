// src/components/VetWorkingHours.jsx// src/components/VetWorkingHours useEffect, useState } from "react";
import { useEffect, useState } from "react";
import "../styles/home.css";

export default function VetWorkingHours() {
  const BASE_URL = "http://localhost:8085";

  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // ✅ KEEP vet_id AS STRING (important)
  const [form, setForm] = useState({
    vet_id: "",
    day: "",
    start: "",
    end: "",
  });

  /* ---------- helpers ---------- */
  const normalizeTime = (time) =>
    time && time.length === 5 ? `${time}:00` : time;

  const unwrap = async (res) => {
    const text = await res.text();
    let json = null;
    try {
      json = text ? JSON.parse(text) : null;
    } catch {}

    if (!res.ok) {
      throw new Error(json?.message || text || `HTTP ${res.status}`);
    }

    return json?.data ?? json;
  };

  /* ---------- GET hours ---------- */
  const fetchHours = async (vetIdStr) => {
    if (!vetIdStr?.trim()) {
      setHours([]);
      return;
    }

    const vetId = Number(vetIdStr);

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${BASE_URL}/vets/${vetId}/working-hours`
      );
      const data = await unwrap(res);

      const normalized = (data || []).map((h) => ({
        working_hour_id: h.id ?? h.workingHourId,
        vet_id: vetId,
        day: h.dayOfWeek ?? h.day,
        start: h.startTime,
        end: h.endTime,
      }));

      setHours(normalized);
    } catch (e) {
      setError(e.message);
      setHours([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- POST add hours ---------- */
  const addHours = async () => {
    if (!form.vet_id || !form.day || !form.start || !form.end) return;

    const vetId = Number(form.vet_id);

    setSaving(true);
    setError("");

    const payload = {
      dayOfWeek: form.day,
      startTime: normalizeTime(form.start),
      endTime: normalizeTime(form.end),
    };

    try {
      const res = await fetch(
        `${BASE_URL}/vets/${vetId}/working-hours`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        throw new Error(await res.text());
      }

      await fetchHours(form.vet_id);

      // ✅ reset only day & time
      setForm((prev) => ({
        ...prev,
        day: "",
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
    fetchHours(form.vet_id);
  }, [form.vet_id]);

  /* ---------- UI ---------- */
  return (
    <div className="home-wrapper vet-page">
      <section className="features-section">
        <div className="vet-shell">
          <div className="feature-card vet-card-premium vet-form-card">

            {/* HEADER */}
            <div className="vet-form-header">
              <div className="vet-kicker">Pet Clinic • Admin</div>
              <h1 className="vet-title">Vet Working Hours</h1>
              <p className="vet-subtitle">
                Define weekly availability for veterinarians.
              </p>
            </div>

            {/* FORM */}
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

                {/* Day */}
                <div className="vet-field">
                  <label className="vet-label">Day</label>
                  <select
                    className="vet-input vet-select"
                    value={form.day}
                    onChange={(e) =>
                      setForm({ ...form, day: e.target.value })
                    }
                    disabled={!Number(form.vet_id)}
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
                    onChange={(e) =>
                      setForm({ ...form, end: e.target.value })
                    }
                    disabled={!Number(form.vet_id)}
                  />
                </div>
              </div>

              {/* ACTION */}
              <div className="vet-form-actions">
                <button
                  className="btn-gradient vet-save-btn"
                  onClick={addHours}
                  disabled={saving || !form.vet_id.trim()}
                >
                  {saving ? "Saving..." : "Add Working Hours"}
                </button>
              </div>
            </div>

            {/* TABLE */}
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
                      <tr key={h.working_hour_id}>
                        <td>{h.working_hour_id}</td>
                        <td>{h.vet_id}</td>
                        <td>{h.day}</td>
                        <td>{String(h.start).slice(0, 5)}</td>
                        <td>{String(h.end).slice(0, 5)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!loading && hours.length === 0 && (
                  <div className="empty-state-premium">
                    No working hours found
                  </div>
                )}
              </div>
            </div>

            <div className="vet-footer-note">
              Spring Boot + DayOfWeek + LocalTime ✅
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
