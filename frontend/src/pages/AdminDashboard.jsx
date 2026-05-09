import { Link } from "react-router-dom";
import { FaUserMd, FaCalendarCheck, FaClock } from "react-icons/fa";

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="fw-bold mb-4">🐾 Admin Dashboard</h2>

      <div className="row g-3">
        {/* Vet Management */}
        <div className="col-md-4">
          <Link to="/admin/vets" className="text-decoration-none">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <FaUserMd size={36} className="mb-3 text-primary" />
                <h5 className="fw-semibold">Vet Management</h5>
                <p className="text-muted mb-0">
                  Create vets & manage vet details
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* All Appointments */}
        <div className="col-md-4">
          <Link to="/admin/appointments" className="text-decoration-none">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <FaCalendarCheck size={36} className="mb-3 text-success" />
                <h5 className="fw-semibold">All Appointments</h5>
                <p className="text-muted mb-0">
                  View all appointments (ADMIN)
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Generate Slots */}
        <div className="col-md-4">
          <Link to="/admin/slots" className="text-decoration-none">
            <div className="card h-100 shadow-sm">
              <div className="card-body text-center">
                <FaClock size={36} className="mb-3 text-warning" />
                <h5 className="fw-semibold">Generate Slots</h5>
                <p className="text-muted mb-0">
                  Create slots for vets (ADMIN)
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}