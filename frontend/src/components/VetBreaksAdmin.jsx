import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../features/vets/components/VetBreaks.css";
import { adminApi } from "../features/admin/adminApi";
 
export default function VetBreaksAdmin() {
  const navigate = useNavigate();
  const [vets, setVets] = useState([]);
  const [error, setError] = useState("");
 
  const errorMessage = (e) =>
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    "Request failed";
 
  const fetchVets = async () => {
    setError("");
    try {
      const list = await adminApi.getVetSummaries();
      setVets(list || []);
    } catch (e) {
      setError(errorMessage(e));
      setVets([]);
    }
  };
 
  useEffect(() => {
    fetchVets();
  }, []);
 
  return (
    <div className="home-wrapper vet-page">
      <section className="features-section">
        <div className="vet-shell wide-shell">
          <div className="feature-card vet-card-premium vet-form-card wide-card">
            <div className="vet-form-header">
              <div className="vet-kicker">Pet Clinic • Admin</div>
              <h1 className="vet-title">Vet Breaks</h1>
              <p className="vet-subtitle">
                Select a vet to manage break timings in a separate page.
              </p>
            </div>
 
            {error && <div className="vet-error">{error}</div>}
 
            <div className="vet-toolbar">
              <button className="btn-outline" onClick={fetchVets}>
                Refresh Vets
              </button>
            </div>
 
            <div className="vet-cards-grid wide-grid">
              {vets.map((v) => (
                <div
                  key={v.vetId}
                  className="vet-mini-card clickable-card"
                  onClick={() =>
                    navigate(`/admin/vets/${v.vetId}/breaks`, {
                      state: { vet: v }, // pass vet summary so details page can show instantly
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
                    </div>
 
                    <div className="vet-mini-action">➜</div>
                  </div>
 
                  <div className="vet-mini-footer">
                    <span className="pill soft">Manage breaks</span>
                    <span className="pill soft">View timetable</span>
                  </div>
                </div>
              ))}
            </div>
 
            {vets.length === 0 && !error && (
              <div className="empty-state-premium">
                <div className="empty-emoji">🩺</div>
                <div className="empty-title">No vets found</div>
                <div className="empty-sub">Once vets exist, they’ll show here.</div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}