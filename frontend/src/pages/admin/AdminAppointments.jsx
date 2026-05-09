import { useEffect, useState } from "react";
import { api } from "../../api/axios";

export default function AdminAppointments() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const res = await api.get("/appointments/admin/appointments");
      setRows(res.data);
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Failed to load appointments"
      );
    } finally {
      setLoading(false);
    }
  }

  async function cancelAppointment(id) {
    setErr("");
    try {
      await api.post(`/appointments/${id}/cancel`);
      await load();
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Cancel failed"
      );
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div>
      <div className="d-flex align-items-center justify-content-between mb-3">
        <h3 className="fw-bold mb-0">All Appointments (Admin)</h3>
        <button className="btn btn-outline-primary btn-sm" onClick={load} disabled={loading}>
          Refresh
        </button>
      </div>

      {err && <div className="alert alert-danger">{err}</div>}

      {loading ? (
        <div className="text-muted">Loading appointments…</div>
      ) : rows.length === 0 ? (
        <div className="text-muted">No appointments found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>ID</th>
                <th>Vet</th>
                <th>Owner</th>
                <th>Status</th>
                <th>Date/Time</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => {
                const id = a.appointmentId ?? a.id;
                return (
                  <tr key={id}>
                    <td>{id}</td>
                    <td>{a.vetId ?? "-"}</td>
                    <td>{a.ownerId ?? "-"}</td>
                    <td>
                      <span className="badge bg-secondary">{a.status ?? "-"}</span>
                    </td>
                    <td>{a.dateTime ?? a.slotTime ?? "-"}</td>
                    <td className="text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => cancelAppointment(id)}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="small text-muted">
            Uses: <code>GET /appointments/admin/appointments</code> and{" "}
            <code>POST /appointments/&lt;id&gt;/cancel</code>.
          </div>
        </div>
      )}
    </div>
  );
}