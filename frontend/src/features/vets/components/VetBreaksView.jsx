import { useEffect, useState } from "react";
import { vetsApi } from "../../../api/modules/vets.api";
import "../../../styles/vet-breaks.css";

export default function VetBreaksView() {
  const [breaks, setBreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const list = await vetsApi.getMyBreaks();

        if (!alive) return;

        setBreaks(Array.isArray(list) ? list : []);

      } catch (e) {
        if (!alive) return;

        setError(
          e?.response?.data?.message ||
          e?.message ||
          "Failed to load breaks"
        );
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
      <div className="breaks-container">

        {/* HEADER */}
        <div className="breaks-header">
          <div>
            <div className="breaks-kicker">PawCare • Vet</div>
            <h3 className="breaks-title">☕ My Breaks</h3>
            <div className="breaks-subtitle">Your scheduled break times</div>
          </div>
        </div>

        {/* STATES */}
        {loading && <p className="breaks-loading">Loading...</p>}
        {error && <div className="vet-error">{error}</div>}

        {!loading && !error && breaks.length === 0 && (
          <div className="breaks-empty">No breaks scheduled</div>
        )}

        {/* TABLE */}
        {!loading && !error && breaks.length > 0 && (
          <table className="breaks-table">
            <thead>
              <tr>
                <th className="col-name">Break</th>
                <th className="col-time">Start</th>
                <th className="col-time">End</th>
              </tr>
            </thead>

            <tbody>
              {breaks.map((b) => (
                <tr key={b.breakId}>
                  <td className="col-name">{b.breakName || "-"}</td>
                  <td className="col-time">{String(b.startTime).slice(0, 5)}</td>
                  <td className="col-time">{String(b.endTime).slice(0, 5)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

      </div>
    </div>
  );
}