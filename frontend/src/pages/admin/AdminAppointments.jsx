import { useEffect, useState } from "react";
import { adminApi } from "../../features/admin/adminApi";
import "../../styles/admin-appointments.css"
export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      setLoading(true);
      const data = await adminApi.getAllAppointmentsAdmin();
      setAppointments(data);
    } catch (e) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading appointments...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
  <div className="admin-appointments">
    <div className="page-header">
      <h2>All Appointments</h2>
      <p className="subtitle">
        Complete list of appointments across all vets
      </p>
    </div>

    {appointments.length === 0 ? (
      <div className="empty-state">
        No appointments found.
      </div>
    ) : (
      <div className="table-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Pet ID</th>
              <th>Vet ID</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a.appointmentId}>
                <td>{a.appointmentId}</td>
                <td>{a.petId}</td>
                <td>{a.vetId}</td>
                <td>
                  <span className={`status ${a.status?.toLowerCase()}`}>
                    {a.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
);

}
