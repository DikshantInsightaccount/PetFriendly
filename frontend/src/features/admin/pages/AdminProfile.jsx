// src/pages/admin/AdminProfile.jsx
import { useAuth } from "../../../auth/AuthContext";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import { useState } from "react";
import { adminApi } from "../adminApi"; 

import "../../../styles/admin-profile.css";

export default function AdminProfile() {
  const { user, setUser } = useAuth();

  const [phone, setPhone] = useState(user?.phoneNumber || "");
  const [address, setAddress] = useState(user?.address || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const updatedUser = await adminApi.updateProfile({
        phoneNumber: phone,
        address: address,
      });

      // update UI immediately
      setUser(updatedUser);

      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("❌ Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-profile-wrapper">
      {/* Back */}
      <Link to="/admin/dashboard" className="back-link">
        <FaArrowLeft />
        Back to Dashboard
      </Link>

      <div className="admin-profile-card">
        <div className="profile-header">
          <h4>My Profile</h4>
          <span className="role-chip">ADMIN</span>
        </div>

        <div className="profile-body">
          {/* Name */}
          <div className="form-group">
            <label>Name</label>
            <input
              className="form-control"
              value={user?.name || ""}
              disabled
            />
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email</label>
            <input
              className="form-control"
              value={user?.email || ""}
              disabled
            />
          </div>

          {/* Phone */}
          <div className="form-group">
            <label>Phone</label>
            <input
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Address */}
          <div className="form-group">
            <label>Address</label>
            <input
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          {/* Save Button */}
          <button
            className="btn btn-save"
            onClick={handleUpdate}
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </div>
      </div>
    </div>
  );
}