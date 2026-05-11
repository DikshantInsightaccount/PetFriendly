import { Link } from "react-router-dom";
import {
  FaPaw,
  FaUserMd,
  FaCalendarCheck,
  FaClock,
  FaUsers,
} from "react-icons/fa";
export default function AdminDashboard() {
  return (
    <div>
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <FaPaw className="text-primary" />
        Admin Dashboard
      </h2>

      <div className="row g-4">
        {/* Vet Management */}
        <div className="col-md-4">
          <Link to="/admin/vets" className="text-decoration-none">
            <div className="feature-card h-100">
              <FaUserMd size={36} className="mb-3 text-primary" />
              <h5 className="fw-semibold">Vet Management</h5>
              <p className="text-muted mb-0">
                Create vets & manage vet schedules
              </p>
            </div>
          </Link>
        </div>

        {/* Owner Management */}
        <div className="col-md-4">
          <Link to="/admin/owners" className="text-decoration-none">
            <div className="feature-card h-100">
              <FaUsers size={36} className="mb-3 text-info" />
              <h5 className="fw-semibold">Owner Management</h5>
              <p className="text-muted mb-0">
                View and manage pet owners
              </p>
            </div>
          </Link>
        </div>

        {/* Appointments */}
        <div className="col-md-4">
          <Link to="/admin/appointments" className="text-decoration-none">
            <div className="feature-card h-100">
              <FaCalendarCheck size={36} className="mb-3 text-success" />
              <h5 className="fw-semibold">Appointments</h5>
              <p className="text-muted mb-0">
                Monitor and control all appointments
              </p>
            </div>
          </Link>
        </div>

        {/* Slot Generator */}
        <div className="col-md-4">
          <Link to="/admin/slots" className="text-decoration-none">
            <div className="feature-card h-100">
              <FaClock size={36} className="mb-3 text-warning" />
              <h5 className="fw-semibold">Slot Generator</h5>
              <p className="text-muted mb-0">
                Generate appointment slots for vets
              </p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
