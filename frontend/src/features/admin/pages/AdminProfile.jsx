// src/pages/admin/AdminProfile.jsx
import { useAuth } from "../../../auth/AuthContext";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";

export default function AdminProfile() {
  const { user } = useAuth();

  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");

  const handleUpdate = () => {
    // Later connect PATCH /users/me
    alert("Profile update logic will go here");
  };

  return (
    <div style={{ maxWidth: 600 }}>
      {/* ✅ Back to Dashboard */}
      <Link
        to="/admin/dashboard"
        className="text-decoration-none mb-3 d-inline-flex align-items-center gap-2"
      >
        <FaArrowLeft />
        Back to Dashboard
      </Link>

      <div className="feature-card mt-3">
        <h4 className="fw-bold mb-4">My Profile</h4>

        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            className="form-control"
            value={user?.name || ""}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            className="form-control"
            value={user?.email || ""}
            disabled
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            className="form-control"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Address</label>
          <input
            className="form-control"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <button className="btn btn-primary" onClick={handleUpdate}>
          Update Profile
        </button>
      </div>
    </div>
  );
}
