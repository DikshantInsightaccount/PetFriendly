import { useEffect, useState } from "react";
import { api } from "../../../api/axios";

export default function VetWorkingHoursView() {
  const [hours, setHours] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const vetId = Number(localStorage.getItem("vetId")); // or from token/context

  useEffect(() => {
    if (!vetId) return;

    setLoading(true);
    setError("");

    api
      .get(`/vets/${vetId}/working-hours`)
      .then((res) => setHours(res.data.data ?? []))
      .catch(() => setError("Failed to load working hours"))
      .finally(() => setLoading(false));
  }, [vetId]);

  return (
    <div className="glass">
      <h3>My Working Hours</h3>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Day</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {hours.map((h) => (
            <tr key={h.workingHourId}>
              <td>{h.dayOfWeek}</td>
              <td>{h.startTime}</td>
              <td>{h.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}