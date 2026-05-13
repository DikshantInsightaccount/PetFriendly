import { Link } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import {
  FaPaw,
  FaUserMd,
  FaCalendarCheck,
  FaClock,
  FaUsers,
} from "react-icons/fa";
 
export default function AdminDashboard() {
  const { user } = useAuth();
 
  return (
    <>
      {/* ✅ INLINE CSS */}
      <style>{`
        .dashboard-wrapper {
         
          min-height: 100vh;        /* ✅ FULL viewport */
         
 
          display: flex;
          flex-direction: column;
          justify-content: center;
          position: relative;
          padding: 2.5rem 4rem;
          overflow: hidden;
          z-index: 0;
        }
 
        /* ✅ Background image ONLY */
        .dashboard-wrapper::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: url("/images/home-bg.jpg");
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          opacity: 0.18;
          z-index: 0;
        }
 
        /* ✅ Content above background */
        .dashboard-wrapper > * {
          position: relative;
          z-index: 1;
        }
 
        /* ✅ Left title */
        .dashboard-title {
          align-self: flex-start;
          margin-bottom: 3rem;
          font-size: 2rem;
          font-weight: 700;
          color: #1b1d1e;
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
 
        /* ✅ Card stack */
        .dashboard-list {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }
 
        /* ✅ Bigger + diagonal cards */
        .admin-card {
          display: flex;
          align-items: center;
          gap: 2rem;
 
          padding: 2.3rem 2.8rem;
          min-height: 135px;
 
          border-radius: 22px;
          color: #ffffff;
 
          transform: skewX(-3deg);
          transition: all 0.35s ease;
 
          box-shadow: 0 18px 42px rgba(0,0,0,0.45);
        }
 
        .admin-card:hover {
          transform: skewX(0deg) translateY(-8px) scale(1.02);
          box-shadow: 0 30px 75px rgba(0,0,0,0.65);
        }
 
        /* ✅ Icon container */
        .admin-icon {
          min-width: 90px;
          min-height: 90px;
          border-radius: 22px;
 
          display: flex;
          align-items: center;
          justify-content: center;
 
          font-size: 40px;
          background: rgba(255, 255, 255, 0.22);
        }
 
        .admin-card h5 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.4rem;
        }
 
        .admin-card p {
          font-size: 0.9rem;
          opacity: 0.9;
          margin: 0;
        }
 
        /* 🎨 Card gradients */
        .card-vets {
          background: linear-gradient(135deg, lightblue, #6d63d6);
        }
 
        .card-owners {
          background: linear-gradient(135deg, #22a8c0, #7fc4e6);
        }
 
        .card-appointments {
          background: linear-gradient(135deg, #7cd39c, #449a63);
        }
 
        .card-slots {
          background: linear-gradient(135deg, #c5a164, #9d6321);
        }
 
        /* ✅ Zig-zag diagonal effect */
        .dashboard-list a:nth-child(odd) .admin-card {
          margin-left: -30px;
        }
 
        .dashboard-list a:nth-child(even) .admin-card {
          margin-left: 30px;
        }
 
        a {
          text-decoration: none;
        }
      `}</style>
 
      {/* ✅ DASHBOARD */}
      <div className="dashboard-wrapper">
        {/* ✅ LEFT TITLE */}
        <h2 className="dashboard-title">
          <FaPaw />
          Welcome back, {user?.name || "Super Admin"}
        </h2>
 
        {/* ✅ CARDS */}
        <div className="dashboard-list">
          <Link to="/admin/vets">
            <div className="admin-card card-vets">
              <div className="admin-icon">
                <FaUserMd />
              </div>
              <div>
                <h5>Vet Management</h5>
                <p>Create vets and manage schedules</p>
              </div>
            </div>
          </Link>
 
          <Link to="/admin/owners">
            <div className="admin-card card-owners">
              <div className="admin-icon">
                <FaUsers />
              </div>
              <div>
                <h5>Owner Management</h5>
                <p>View and manage pet owners</p>
              </div>
            </div>
          </Link>
 
          <Link to="/admin/appointments">
            <div className="admin-card card-appointments">
              <div className="admin-icon">
                <FaCalendarCheck />
              </div>
              <div>
                <h5>Appointments</h5>
                <p>Monitor all appointments</p>
              </div>
            </div>
          </Link>
 
          <Link to="/admin/slots">
            <div className="admin-card card-slots">
              <div className="admin-icon">
                <FaClock />
              </div>
              <div>
                <h5>Slot Generator</h5>
                <p>Generate vet appointment slots</p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
}