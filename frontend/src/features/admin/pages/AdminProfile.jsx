// src/pages/admin/AdminProfile.jsx
import { useAuth } from "../../../auth/AuthContext";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import "../../../styles/admin-profile.css"
export default function AdminProfile() {
  const { user } = useAuth();

  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");

  const handleUpdate = () => {
    // Later connect PATCH /users/me
    alert("Profile update logic will go here");
  };

  return (
    <div className="admin-profile-wrapper">
  {/* Back */}
  <Link
    to="/admin/dashboard"
    className="back-link"
  >
    <FaArrowLeft />
    Back to Dashboard
  </Link>

  <div className="admin-profile-card">
    <div className="profile-header">
      <h4>My Profile</h4>
      <span className="role-chip">ADMIN</span>
    </div>

    <div className="profile-body">
      <div className="form-group">
        <label>Name</label>
        <input
          className="form-control"
          value={user?.name || ""}
          disabled
        />
      </div>

      <div className="form-group">
        <label>Email</label>
        <input
          className="form-control"
          value={user?.email || ""}
          disabled
        />
      </div>

      <div className="form-group">
        <label>Phone</label>
        <input
          className="form-control"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label>Address</label>
        <input
          className="form-control"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
      </div>

      <button className="btn btn-save" onClick={handleUpdate}>
        Update Profile
      </button>
    </div>
  </div>
</div>
  );
}
