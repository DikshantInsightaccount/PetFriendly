import { useEffect, useState } from "react";
import { api } from "../../../api/axios";

export default function VetBreaksView() {
  const [breaks, setBreaks] = useState([]);
  const [loading, setLoading] = useState(false);

  const vetId = Number(localStorage.getItem("vetId"));

  useEffect(() => {
    if (!vetId) return;

    setLoading(true);
    api
      .get(`/vets/${vetId}/breaks`)
      .then((res) => setBreaks(res.data.data ?? []))
      .finally(() => setLoading(false));
  }, [vetId]);

  return (
    <div className="glass">
      <h3>My Breaks</h3>

      {loading && <p>Loading...</p>}

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Start</th>
            <th>End</th>
          </tr>
        </thead>
        <tbody>
          {breaks.map((b) => (
            <tr key={b.breakId}>
              <td>{b.breakName ?? "-"}</td>
              <td>{b.startTime}</td>
              <td>{b.endTime}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
``