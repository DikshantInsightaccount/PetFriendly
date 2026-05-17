import { useEffect, useState } from "react";
import { vetsApi } from "../../../api/modules/vets.api";
import "../../../styles/vet-working-hours.css";

export default function VetWorkingHoursView() {

  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const list = await vetsApi.getMyWorkingHours();

        if (!alive) return;

        setHours(Array.isArray(list) ? list : []);

      } catch (e) {
        if (!alive) return;

        setError(
          e?.response?.data?.message ||
          e?.message ||
          "Failed to load working hours"
        );

        setHours([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    };

    load();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <div className="vet-page">
      <div className="vet-shell">
        <div className="vet-card-premium">

          {/* ✅ HEADER */}
          <div className="vw-top">
            <div>
              <div className="vw-kicker">PawCare • Vet</div>
              <h3 className="vw-title">🕒 My Working Hours</h3>
              <div className="vw-subtitle">
                Your weekly schedule
              </div>
            </div>
          </div>

          {/* ✅ STATES */}
          {loading && <div className="vw-muted">Loading...</div>}

          {error && <div className="vet-error">{error}</div>}

          {!loading && !error && hours.length === 0 && (
            <div className="vw-empty">No working hours found</div>
          )}

          {/* ✅ DATA */}
          {!loading && !error && hours.length > 0 && (
            <div className="vw-tableWrap">
              <table className="working-hours-table">

                <thead>
                  <tr>
                    <th className="col-day">Day</th>
                    <th className="col-time">Start</th>
                    <th className="col-time">End</th>
                  </tr>
                </thead>

                <tbody>
                  {hours.map((h) => (
                    <tr key={h.workingHourId}>
                      <td className="col-day">{h.dayOfWeek}</td>
                      <td className="col-time">{String(h.startTime).slice(0, 5)}</td>
                      <td className="col-time">{String(h.endTime).slice(0, 5)}</td>
                    </tr>
                  ))}
                </tbody>


              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
