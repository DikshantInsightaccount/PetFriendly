// src/components/VetLeaves.jsx
import { useEffect, useMemo, useState } from "react";
import "../styles/home.css";
import { api } from "../api/axios";

/**
 * Uses:
 *  GET  /vets/{vetId}/holidays
 *  POST /vets/{vetId}/leave
 *
 * Uses axios instance (api) → baseURL + auth handled globally
 */
export default function VetLeaves() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // keep vet_id as string for UX
  const [form, setForm] = useState({
    vet_id: "",
    start_date: "",
    end_date: "",
    reason: "",
  });

  /* ---------- helpers ---------- */
  const unwrap = (payload) => {
    // Supports ResponseMessage<T> { message, statusCode, data } OR raw JSON
    if (payload && typeof payload === "object" && "data" in payload) return payload.data;
    return payload;
  };

  const errorMessage = (e) =>
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    "Request failed";

  const toISODate = (d) => (d ? String(d).slice(0, 10) : "");

  const formatDateTime = (dt) => {
    if (!dt) return "-";
    const s = String(dt);
    const normalized = s.includes("T") ? s : s.replace(" ", "T");
    const date = new Date(normalized);
    return isNaN(date.getTime()) ? s : date.toLocaleString();
  };

  const vetId = useMemo(() => Number(form.vet_id) || 0, [form.vet_id]);
  const isVetIdValid = vetId > 0;

  const dateRangeValid = useMemo(() => {
    if (!form.start_date || !form.end_date) return true; // allow typing
    return form.end_date >= form.start_date;
  }, [form.start_date, form.end_date]);

  /* ---------- GET leaves/holidays ---------- */
  const fetchLeaves = async (id) => {
    if (!id) {
      setLeaves([]);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.get(`/vets/${id}/holidays`);
      const data = unwrap(res.data);

      const normalized = (data || []).map((l) => ({
        id: l.leaveId ?? l.leave_id ?? l.id ?? l.leaveID,
        vet_id: l.vetId ?? l.vet_id ?? id,
        start_date: l.startDate ?? l.start_date ?? l.start ?? l.fromDate,
        end_date: l.endDate ?? l.end_date ?? l.end ?? l.toDate,
        reason: l.reason ?? l.leaveReason ?? l.notes ?? "",
        created_at: l.createdAt ?? l.created_at ?? l.created ?? null,
        updated_at: l.updatedAt ?? l.updated_at ?? l.updated ?? null,
      }));

      setLeaves(normalized);
    } catch (e) {
      setError(errorMessage(e));
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  /* ---------- POST apply leave ---------- */
  const applyLeave = async () => {
    if (!isVetIdValid || !form.start_date || !form.end_date || !form.reason) return;

    if (form.end_date < form.start_date) {
      setError("End date cannot be earlier than start date.");
      return;
    }

    setSaving(true);
    setError("");

    const payload = {
      startDate: form.start_date,
      endDate: form.end_date,
      reason: form.reason,
    };

    try {
      await api.post(`/vets/${vetId}/leave`, payload);

      // refresh list after save
      await fetchLeaves(vetId);

      // reset only leave fields (keep vet_id)
      setForm((prev) => ({
        ...prev,
        start_date: "",
        end_date: "",
        reason: "",
      }));
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  /* ---------- auto load on vet_id ---------- */
  useEffect(() => {
    fetchLeaves(vetId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vetId]);

  /* ---------- UI ---------- */
  return (
    <div className="home-wrapper vet-page">
      <section className="features-section">
        <div className="vet-shell">
          <div className="feature-card vet-card-premium vet-form-card">
            {/* HEADER */}
            <div className="vet-form-header">
              <div className="vet-kicker">Pet Clinic • Vet</div>
              <h1 className="vet-title">Vet Leaves</h1>
              <p className="vet-subtitle">
                Track veterinarian leave/holiday dates to avoid appointment conflicts.
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

              {/* ACTION */}
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

            {/* TABLE */}
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

            <div className="vet-footer-note">Spring Boot + LocalDate ✅ (Leave/Holidays endpoints)</div>
          </div>
        </div>
      </section>
    </div>
  );
}