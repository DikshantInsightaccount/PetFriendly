// src/components/AdminStatsCards.jsx
import { Link } from "react-router-dom";
import { FaUserMd, FaUsers, FaUserShield, FaCalendarCheck } from "react-icons/fa";

export default function AdminStatsCards({ stats }) {
  const items = [
    {
      title: "Users",
      value: stats.totalUsers ?? 0,
      icon: <FaUsers size={28} className="text-primary" />,
      hint: "All roles combined",
      link: "/admin/users",
    },
    {
      title: "Vets",
      value: stats.totalVets ?? 0,
      icon: <FaUserMd size={28} className="text-success" />,
      hint: "Role = VET",
      link: "/admin/vets",
    },
    {
      title: "Admins",
      value: stats.totalAdmins ?? 0,
      icon: <FaUserShield size={28} className="text-warning" />,
      hint: "Role = ADMIN",
      link: "/admin/users",
    },
    {
      title: "Appointments",
      value: stats.totalAppointments ?? 0,
      icon: <FaCalendarCheck size={28} className="text-info" />,
      hint: "Admin view",
      link: "/admin/appointments",
    },
  ];

  return (
    <div className="row g-3 mb-3">
      {items.map((x) => (
        <div key={x.title} className="col-md-3">
          <Link to={x.link} className="text-decoration-none">
            <div className="card h-100 shadow-sm">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted small">{x.title}</div>
                    <div className="fs-4 fw-bold">{x.value}</div>
                    <div className="text-muted small">{x.hint}</div>
                  </div>
                  {x.icon}
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
