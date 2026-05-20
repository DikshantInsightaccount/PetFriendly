VetWorkingHoursDetails
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import "../../../styles/home.css";
import { adminApi } from "../../admin/adminApi";
 
export default function VetWorkingHoursDetails() {
  const { vetId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
 
  const vetIdNum = useMemo(() => Number(vetId), [vetId]);
 
  const [vet, setVet] = useState(location.state?.vet || null);
 
  const [workingHoursList, setWorkingHoursList] = useState([]); // LIST from backend
  const [loadingWH, setLoadingWH] = useState(true);
  const [savingWH, setSavingWH] = useState(false);
 
  const [whForm, setWhForm] = useState({
    startTime: "",
    endTime: "",
    days: ["MON", "TUE", "WED", "THU", "FRI"],
  });
 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
 
  const errorMessage = (e) =>
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    "Request failed";
 
  const unwrap = (payload) =>
    payload && typeof payload === "object" && "data" in payload
      ? payload.data
      : payload;
 
  const normalizeTime = (time) =>
    time && time.length === 5 ? `${time}:00` : time;
 
  const toHHMM = (t) => (t ? String(t).slice(0, 5) : "");
 
  const DAYS_ORDER = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
 
  // If user refreshes page -> state lost -> fetch vet info from summaries
  const fetchVetIfNeeded = async () => {
    if (vet) return;
    try {
      const list = await adminApi.getVetSummaries();
      const found = (list || []).find((x) => Number(x.vetId) === vetIdNum);
      setVet(found || null);
    } catch {
      setVet(null);
    }
  };
 
  const fetchWorkingHours = async () => {
    if (!vetIdNum) return;
 
    setLoadingWH(true);
    setError("");
    setSuccess("");
 
    try {
      const res = await adminApi.getVetWorkingHours(vetIdNum);
      const data = unwrap(res);
      const list = Array.isArray(data) ? data : [];
      setWorkingHoursList(list);
 
      if (list.length > 0) {
        const uniqueStarts = [...new Set(list.map((x) => toHHMM(x.startTime)))];
        const uniqueEnds = [...new Set(list.map((x) => toHHMM(x.endTime)))];
        const days = [...new Set(list.map((x) => x.dayOfWeek).filter(Boolean))]
          .sort((a, b) => DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b));
 
        if (uniqueStarts.length === 1 && uniqueEnds.length === 1) {
          setWhForm({
            startTime: uniqueStarts[0],
            endTime: uniqueEnds[0],
            days: days.length ? days : ["MON", "TUE", "WED", "THU", "FRI"],
          });
        }
      }
    } catch (e) {
      setWorkingHoursList([]);
    } finally {
      setLoadingWH(false);
    }
  };
 
  useEffect(() => {
    fetchVetIfNeeded();
    fetchWorkingHours();
  }, [vetIdNum]);
 
  const toggleDay = (day) => {
    setWhForm((p) => {
      const exists = p.days.includes(day);
      const days = exists ? p.days.filter((d) => d !== day) : [...p.days, day];
      return { ...p, days };
    });
  };
 
  const saveWorkingHours = async () => {
    setSuccess("");
    if (!whForm.startTime || !whForm.endTime) {
      setError("Please select working start & end time.");
      return;
    }
    if (whForm.endTime <= whForm.startTime) {
      setError("Working end time must be after start time.");
      return;
    }
    if (!whForm.days?.length) {
      setError("Please select at least one day.");
      return;
    }
 
    setSavingWH(true);
    setError("");
 
    try {
      const startTime = normalizeTime(whForm.startTime);
      const endTime = normalizeTime(whForm.endTime);
 

      const results = await Promise.all(
        whForm.days.map(async (day) => {
          try {
            return await adminApi.addVetWorkingHour(vetIdNum, {
              dayOfWeek: day,
              startTime,
              endTime,
            });
          } catch (e) {
            
            return { __error: true, day, message: errorMessage(e) };
          }
        })
      );
 
      const failed = results.filter((r) => r && r.__error);
      if (failed.length) {
        setError(
          `Some days could not be saved: ${failed
            .map((f) => `${f.day} (${f.message})`)
            .join(", ")}`
        );
      } else {
        setSuccess("Working hours saved successfully.");
      }
 
      await fetchWorkingHours();
    } finally {
      setSavingWH(false);
    }
  };
 
  // Pretty view: group hours by day
  const groupedByDay = useMemo(() => {
    const map = {};
    (workingHoursList || []).forEach((x) => {
      const d = x.dayOfWeek || "—";
      if (!map[d]) map[d] = [];
      map[d].push(x);
    });
 
    // sort time ranges inside day
    Object.keys(map).forEach((d) => {
      map[d].sort((a, b) => String(a.startTime).localeCompare(String(b.startTime)));
    });
 
    return map;
  }, [workingHoursList]);
 
  const sortedDays = useMemo(() => {
    const present = Object.keys(groupedByDay);
    return present.sort((a, b) => DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b));
  }, [groupedByDay]);
 
  return (
    <div className="home-wrapper vet-page">
      <section className="features-section">
        <div className="vet-shell wide-shell">
          <div className="feature-card vet-card-premium vet-form-card wide-card">
            <div className="details-topbar">
              <button className="btn-outline" onClick={() => navigate(-1)}>
                ← Back
              </button>
 
              <button
                className="btn-outline"
                onClick={fetchWorkingHours}
                disabled={loadingWH}
              >
                {loadingWH ? "Refreshing..." : "Refresh"}
              </button>
            </div>
 
            <div className="vet-form-header">
              <div className="vet-kicker">Pet Clinic • Admin</div>
              <h1 className="vet-title">Vet Working Hours Details</h1>
              <p className="vet-subtitle">
                View and set working schedule (stored per day in backend).
              </p>
            </div>
 
            {error && <div className="vet-error">{error}</div>}
            {success && (
              <div
                className="vet-error"
                style={{
                  background: "#ecfdf5",
                  borderColor: "#a7f3d0",
                  color: "#065f46",
                }}
              >
                {success}
              </div>
            )}
 
            <div className="details-grid">
              {/* Vet Info + Current Hours */}
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
 
                <div style={{ marginTop: 18 }}>
                  <div className="section-title" style={{ marginBottom: 10 }}>
                    Current Working Hours
                  </div>
 
                  {loadingWH ? (
                    <div style={{ color: "#6b7280" }}>Loading...</div>
                  ) : workingHoursList?.length ? (
                    <div
                      style={{
                        border: "1px solid rgba(229,231,235,0.8)",
                        borderRadius: 14,
                        overflow: "hidden",
                        background: "rgba(255,255,255,0.7)",
                      }}
                    >
                      {sortedDays.map((d) => (
                        <div
                          key={d}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            gap: 12,
                            padding: "10px 12px",
                            borderBottom:
                              d === sortedDays[sortedDays.length - 1]
                                ? "none"
                                : "1px solid rgba(229,231,235,0.8)",
                          }}
                        >
                          <div style={{ fontWeight: 800 }}>{d}</div>
                          <div style={{ opacity: 0.9 }}>
                            {(groupedByDay[d] || []).map((x, idx) => (
                              <span
                                key={`${d}-${idx}`}
                                className="pill soft"
                                style={{ marginLeft: 8 }}
                              >
                                {toHHMM(x.startTime)} - {toHHMM(x.endTime)}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ color: "#6b7280" }}>
                      Not set yet. Use the form to add.
                    </div>
                  )}
                </div>
              </div>
 
              {/* Working Hours Form */}
              <div className="details-card">
                <div className="section-title">Set Working Hours</div>
 
                <div className="vet-form-grid">
                  <div className="vet-field">
                    <label className="vet-label">Start</label>
                    <input
                      type="time"
                      className="vet-input"
                      value={whForm.startTime}
                      onChange={(e) =>
                        setWhForm((p) => ({ ...p, startTime: e.target.value }))
                      }
                    />
                  </div>
 
                  <div className="vet-field">
                    <label className="vet-label">End</label>
                    <input
                      type="time"
                      className="vet-input"
                      value={whForm.endTime}
                      onChange={(e) =>
                        setWhForm((p) => ({ ...p, endTime: e.target.value }))
                      }
                    />
                  </div>
 
                  <div className="vet-field">
                    <label className="vet-label">Days</label>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {DAYS_ORDER.map((d) => {
                        const active = whForm.days.includes(d);
                        return (
                          <button
                            key={d}
                            type="button"
                            className="btn-outline"
                            onClick={() => toggleDay(d)}
                            style={{
                              padding: "8px 12px",
                              borderRadius: 999,
                              background: active ? "#eef2ff" : "transparent",
                              color: active ? "#3730a3" : "#111827",
                              borderColor: active ? "#c7d2fe" : "#e5e7eb",
                            }}
                          >
                            {d}
                          </button>
                        );
                      })}
                    </div>
 
                    {/* <div style={{ marginTop: 10, fontSize: 12, opacity: 0.75 }}>
                      Note: Your backend blocks duplicates per day. If a day
                      already exists, saving again will fail unless you implement
                      an update/upsert endpoint.
                    </div> */}
                  </div>
                </div>
 
                <div className="vet-form-actions" style={{ marginTop: 16 }}>
                  <button
                    className="btn-gradient"
                    onClick={saveWorkingHours}
                    disabled={savingWH}
                  >
                    {savingWH ? "Saving..." : "Save Working Hours"}
                  </button>
 
                  <button
                    className="btn-outline"
                    onClick={() =>
                      setWhForm({
                        startTime: "",
                        endTime: "",
                        days: ["MON", "TUE", "WED", "THU", "FRI"],
                      })
                    }
                    disabled={savingWH}
                  >
                    Clear
                  </button>
                </div>
              </div>
            </div>
 
            {/* Breaks section can be added later */}
          </div>
        </div>
      </section>
    </div>
  );
}