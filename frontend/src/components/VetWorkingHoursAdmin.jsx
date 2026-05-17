import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home.css";
import { adminApi } from "../features/admin/adminApi";
 
export default function VetWorkingHoursAdmin() {
  const navigate = useNavigate();
 
  const [vets, setVets] = useState([]);
  const [hoursByVetId, setHoursByVetId] = useState({}); // vetId -> LIST of working hours
  const [loadingHours, setLoadingHours] = useState(false);
  const [error, setError] = useState("");
 
  const errorMessage = (e) =>
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    "Request failed";
 
  // Handles both:
  // 1) unwrap(list)
  // 2) wrapper: { data: list }
  const unwrap = (payload) =>
    payload && typeof payload === "object" && "data" in payload
      ? payload.data
      : payload;
 
  const toHHMM = (t) => (t ? String(t).slice(0, 5) : "—");
 
  const DAYS_ORDER = useMemo(
    () => ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"],
    []
  );
 
  const summarizeWorkingHours = (list) => {
    const arr = Array.isArray(list) ? list : [];
    if (arr.length === 0) return null;
 
    const days = [...new Set(arr.map((x) => x.dayOfWeek).filter(Boolean))].sort(
      (a, b) => DAYS_ORDER.indexOf(a) - DAYS_ORDER.indexOf(b)
    );
 
    const startTimes = [...new Set(arr.map((x) => toHHMM(x.startTime)))];
    const endTimes = [...new Set(arr.map((x) => toHHMM(x.endTime)))];
 
    // single consistent schedule across days
    if (startTimes.length === 1 && endTimes.length === 1) {
      return {
        multi: false,
        startTime: startTimes[0],
        endTime: endTimes[0],
        days,
      };
    }
 
    // multiple different ranges exist
    return { multi: true, days, rows: arr };
  };
 
  const fetchVetsAndHours = async () => {
    setError("");
    setLoadingHours(true);
 
    try {
      const list = await adminApi.getVetSummaries();
      const safeList = Array.isArray(list) ? list : [];
      setVets(safeList);
 
      const pairs = await Promise.all(
        safeList.map(async (v) => {
          try {
            const res = await adminApi.getVetWorkingHours(v.vetId);
            const whList = unwrap(res);
            return [v.vetId, Array.isArray(whList) ? whList : []];
          } catch {
            return [v.vetId, []];
          }
        })
      );
 
      const map = {};
      for (const [id, wh] of pairs) map[id] = wh;
      setHoursByVetId(map);
    } catch (e) {
      setError(errorMessage(e));
      setVets([]);
      setHoursByVetId({});
    } finally {
      setLoadingHours(false);
    }
  };
 
  useEffect(() => {
    fetchVetsAndHours();
    
  }, []);
 
  return (
    <div className="home-wrapper vet-page">
      <section className="features-section">
        <div className="vet-shell wide-shell">
          <div className="feature-card vet-card-premium vet-form-card wide-card">
            <div className="vet-form-header">
              <div className="vet-kicker">Pet Clinic • Admin</div>
              <h1 className="vet-title">Vet Working Hours</h1>
              <p className="vet-subtitle">
                Click a vet to view / set working hours (per day).
              </p>
            </div>
 
            {error && <div className="vet-error">{error}</div>}
 
            <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
              <button className="btn-outline" onClick={fetchVetsAndHours}>
                {loadingHours ? "Refreshing..." : "Refresh"}
              </button>
            </div>
 
            <div className="vet-cards-grid wide-grid">
              {vets.map((v) => {
                const whList = hoursByVetId[v.vetId];
                const summary = summarizeWorkingHours(whList);
 
                return (
                  <div
                    key={v.vetId}
                    className="vet-mini-card clickable-card"
                    onClick={() =>
                      navigate(`/admin/vets/${v.vetId}/working-hours`, {
                        state: { vet: v },
                      })
                    }
                  >
                    <div className="vet-mini-card-top">
                      <div>
                        <div className="vet-mini-name">{v.name}</div>
                        <div className="vet-mini-email">{v.email || "—"}</div>
 
                        <div className="vet-mini-sub">
                          <span className="pill">Vet ID: {v.vetId}</span>
                          <span className="pill">User ID: {v.userId}</span>
                        </div>
 
                        <div style={{ marginTop: 14 }}>
                          <div style={{ fontWeight: 700, opacity: 0.9 }}>
                            Working Hours
                          </div>
 
                          {summary ? (
                            summary.multi ? (
                              <div style={{ marginTop: 6 }}>
                                <span className="pill soft">
                                  Multiple schedules
                                </span>
                                <div style={{ marginTop: 8, opacity: 0.85 }}>
                                  Days:{" "}
                                  {summary.days?.length
                                    ? summary.days.join(", ")
                                    : "—"}
                                </div>
                              </div>
                            ) : (
                              <div style={{ marginTop: 6 }}>
                                <span className="pill soft">
                                  {summary.startTime} - {summary.endTime}
                                </span>
                                <div style={{ marginTop: 8, opacity: 0.85 }}>
                                  Days:{" "}
                                  {summary.days?.length
                                    ? summary.days.join(", ")
                                    : "—"}
                                </div>
                              </div>
                            )
                          ) : (
                            <div style={{ marginTop: 6, opacity: 0.85 }}>
                              <span className="pill soft">
                                Not set (click to add)
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
 
                      <div className="vet-mini-action">➜</div>
                    </div>
                  </div>
                );
              })}
            </div>
 
            {vets.length === 0 && !error && (
              <div className="empty-state-premium">
                <div className="empty-emoji">🩺</div>
                <div className="empty-title">No vets found</div>
                <div className="empty-sub">
                  Once vets exist, they’ll show here.
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}