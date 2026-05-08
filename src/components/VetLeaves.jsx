// src/components/VetLeaves.jsx
import { useEffect, useMemo, useState } from "react";
import "../styles/home.css";

export default function VetLeaves() {
  const BASE_URL = "http://localhost:8085";

  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // keep vet_id as string (same as your breaks)
  const [form, setForm] = useState({
    vet_id: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  /* ---------- helpers ---------- */
  // Handles ResponseMessage<T> and also raw JSON
  const unwrap = async (res) => {
    const text = await res.text();
    let json = null;

    try {
      json = text ? JSON.parse(text) : null;
    } catch {}

    if (!res.ok) {
      throw new Error(json?.message || text || `HTTP ${res.status}`);
    }

    // Supports { message, statusCode, data }
    return json?.data ?? json;
  };

  const toISODate = (d) => (d ? String(d).slice(0, 10) : "");

  const formatDateTime = (dt) => {
    if (!dt) return "-";
    const asString = String(dt);
    // if backend returns "2026-05-05T12:24:53" or "2026-05-05 12:24:53"
    const normalized = asString.includes("T")
      ? asString
      : asString.replace(" ", "T");
    const date = new Date(normalized);
    return isNaN(date.getTime()) ? asString : date.toLocaleString();
  };

  const isVetIdValid = useMemo(() => Number(form.vet_id) > 0, [form.vet_id]);

  const dateRangeValid = useMemo(() => {
    if (!form.start_date || !form.end_date) return true; // don't block while typing
    return form.end_date >= form.start_date;
  }, [form.start_date, form.end_date]);

  /* ---------- GET leaves/holidays ---------- */
  const fetchLeaves = async (vetIdStr) => {
    if (!vetIdStr?.trim()) {
      setLeaves([]);
      return;
    }

    const vetId = Number(vetIdStr);
    if (!vetId) {
      setLeaves([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/vets/${vetId}/holidays`);
      const data = await unwrap(res);

      // Normalize shapes in case backend fields differ
      const normalized = (data || []).map((l) => ({
        id: l.leaveId ?? l.leave_id ?? l.id ?? l.leaveID,
        vet_id: l.vetId ?? l.vet_id ?? vetId,
        start_date:
          l.startDate ?? l.start_date ?? l.start ?? l.startdate ?? l.fromDate,
        end_date: l.endDate ?? l.end_date ?? l.end ?? l.enddate ?? l.toDate,
        reason: l.reason ?? l.leaveReason ?? l.notes ?? "",
        created_at: l.createdAt ?? l.created_at ?? l.created ?? null,
        updated_at: l.updatedAt ?? l.updated_at ?? l.updated ?? null,
      }));

      setLeaves(normalized);
    } catch (e) {
      setError(e.message);
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- POST apply leave ---------- */
  const applyLeave = async () => {
    if (!form.vet_id || !form.start_date || !form.end_date || !form.reason) return;

    const vetId = Number(form.vet_id);
    if (!vetId) return;

    if (form.end_date < form.start_date) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    setSaving(true);
    setError("");

    /**
     * ✅ Payload: use what Spring/Jackson typically maps for VetLeave:
     * startDate, endDate, reason
     *
     * If your entity uses snake_case fields in JSON (start_date/end_date),
     * then change keys accordingly OR add @JsonProperty in backend.
     */
    const payload = {
      startDate: form.start_date,
      endDate: form.end_date,
      reason: form.reason,
    };

    try {
      const res = await fetch(`${BASE_URL}/vets/${vetId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      await unwrap(res);

      // refresh list after save
      await fetchLeaves(form.vet_id);

      // reset only leave fields (keep vet_id)
      setForm((prev) => ({
        ...prev,
        start_date: "",
        end_date: "",
        reason: "",
      }));
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  /* ---------- auto load on vet_id ---------- */
  useEffect(() => {
    fetchLeaves(form.vet_id);
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
              <h1 className="vet-title">Vet Leaves</h1>
              <p className="vet-subtitle">
                Track veterinarian leave/holiday dates to avoid appointment conflicts.
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
                    onChange={(e) => setForm({ ...form, vet_id: e.target.value })}
                  />
                </div>

                {/* Start Date */}
                <div className="vet-field">
                  <label className="vet-label">Start Date</label>
                  <input
                    type="date"
                    className="vet-input"
                    value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    disabled={!isVetIdValid}
                  />
                </div>

                {/* End Date */}
                <div className="vet-field">
                  <label className="vet-label">End Date</label>
                  <input
                    type="date"
                    className="vet-input"
                    value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    disabled={!isVetIdValid}
                  />
                  {!dateRangeValid && (
                    <div className="vet-hint" style={{ color: "#ffb4b4", marginTop: 6 }}>
                      End date must be same or after start date.
                    </div>
                  )}
                </div>

                {/* Reason */}
                <div className="vet-field" style={{ gridColumn: "1 / -1" }}>
                  <label className="vet-label">Reason</label>
                  <input
                    className="vet-input"
                    placeholder="Family trip, Health issue..."
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    disabled={!isVetIdValid}
                  />
                </div>
              </div>

              {/* ✅ ACTION */}
              <div className="vet-form-actions">
                <button
                  type="button"
                  className="btn-gradient vet-save-btn"
                  onClick={applyLeave}
                  disabled={
                    saving ||
                    !isVetIdValid ||
                    !form.start_date ||
                    !form.end_date ||
                    !form.reason ||
                    !dateRangeValid
                  }
                >
                  {saving ? "Saving..." : "Apply Leave"}
                </button>
              </div>
            </div>

            {/* 🧾 TABLE */}
            <div className="vet-table-card">
              <div className="vet-table-top">
                <div className="vet-table-meta">
                  <span className="vet-pill">Total Leaves: {leaves.length}</span>
                  <span className="vet-dot" />
                  <span className="vet-muted">Scheduled veterinarian holidays/leaves</span>
                </div>
              </div>

              <div className="vet-table-wrap">
                <table className="vet-table-premium">
                  <thead>
                    <tr>
                      <th>Leave ID</th>
                      <th>Vet ID</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Reason</th>
                      <th>Created</th>
                      <th>Updated</th>
                    </tr>
                  </thead>

                  <tbody>
                    {leaves.map((l) => (
                      <tr key={l.id ?? `${l.vet_id}-${l.start_date}-${l.end_date}`}>
                        <td>{l.id ?? "-"}</td>
                        <td>{l.vet_id}</td>
                        <td>{toISODate(l.start_date)}</td>
                        <td>{toISODate(l.end_date)}</td>
                        <td>{l.reason}</td>
                        <td>{formatDateTime(l.created_at)}</td>
                        <td>{formatDateTime(l.updated_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!loading && leaves.length === 0 && (
                  <div className="empty-state-premium">
                    <div className="empty-emoji">📅</div>
                    <div className="empty-title">No leaves found</div>
                    <div className="empty-sub">
                      Enter a Vet ID to load leaves, or apply a new leave.
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="empty-state-premium">
                    <div className="empty-title">Loading leaves...</div>
                  </div>
                )}
              </div>
            </div>

            {/* ✨ FOOTER NOTE */}
            <div className="vet-footer-note">
              Spring Boot + LocalDate ✅ (Leave/Holidays endpoints)
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
