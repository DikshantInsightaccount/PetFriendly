// src/pages/VetProfile.jsx
import { useEffect, useMemo, useState } from "react";
import "../styles/home.css";
import { api } from "../api/axios";

export default function VetProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ email: "", phoneNumber: "", address: "" });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  /* ---------- helpers ---------- */
  const unwrap = (payload) => (payload && typeof payload === "object" && "data" in payload ? payload.data : payload);

  const errorMessage = (e) =>
    e?.response?.data?.message || e?.response?.data?.error || e?.message || "Request failed";

  const validate = useMemo(() => {
    const e = {};
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.phoneNumber && !/^\d{10}$/.test(form.phoneNumber)) e.phoneNumber = "Enter a 10-digit phone number";
    return e;
  }, [form.email, form.phoneNumber]);

  /* ---------- API ---------- */
  const loadProfile = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.get("/users/me");
      const u = unwrap(res.data);

      setProfile(u);
      setForm({
        email: u?.email ?? "",
        phoneNumber: u?.phoneNumber ?? u?.phone ?? "",
        address: u?.address ?? "",
      });
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    setSuccess("");
    setError("");

    if (Object.keys(validate).length > 0) {
      setError(Object.values(validate)[0]); // show first error
      return;
    }

    setSaving(true);
    try {
      const payload = {
        email: form.email?.trim() || null,
        phoneNumber: form.phoneNumber?.trim() || null,
        address: form.address?.trim() || null,
      };

      const res = await api.patch("/users/me", payload);
      const updated = unwrap(res.data);

      setProfile(updated);
      setSuccess("Profile updated successfully ✅");
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  return (
    <div className="home-wrapper vet-page">
      <section className="features-section">
        <div className="vet-shell">
          <div className="feature-card vet-card-premium vet-form-card">
            <div className="vet-form-header">
              <div className="vet-kicker">Pet Clinic • Vet</div>
              <h1 className="vet-title">My Profile</h1>
              <p className="vet-subtitle">Update your contact details for appointment coordination.</p>
            </div>

            <div className="vet-form-inner">
              {error && <div className="vet-error">{error}</div>}
              {success && <div className="vet-success" style={{ color: "#7CFFB2", marginBottom: 12 }}>{success}</div>}

              {loading ? (
                <div className="empty-state-premium">
                  <div className="empty-title">Loading profile...</div>
                </div>
              ) : (
                <>
                  <div className="vet-form-grid">
                    <div className="vet-field">
                      <label className="vet-label">Name</label>
                      <input className="vet-input" value={profile?.name ?? ""} disabled />
                    </div>

                    <div className="vet-field">
                      <label className="vet-label">Role</label>
                      <input className="vet-input" value={profile?.role ?? "VET"} disabled />
                    </div>

                    <div className="vet-field">
                      <label className="vet-label">Email</label>
                      <input
                        className={`vet-input ${validate.email ? "vet-input-error" : ""}`}
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="you@example.com"
                      />
                      {validate.email && <div className="vet-error">{validate.email}</div>}
                    </div>

                    <div className="vet-field">
                      <label className="vet-label">Phone</label>
                      <input
                        className={`vet-input ${validate.phoneNumber ? "vet-input-error" : ""}`}
                        value={form.phoneNumber}
                        onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                        placeholder="10-digit number"
                      />
                      {validate.phoneNumber && <div className="vet-error">{validate.phoneNumber}</div>}
                    </div>

                    <div className="vet-field" style={{ gridColumn: "1 / -1" }}>
                      <label className="vet-label">Address</label>
                      <input
                        className="vet-input"
                        value={form.address}
                        onChange={(e) => setForm({ ...form, address: e.target.value })}
                        placeholder="Your address..."
                      />
                    </div>
                  </div>

                  <div className="vet-form-actions">
                    <button className="btn-outline-modern vet-cancel-btn" onClick={loadProfile} disabled={saving}>
                      Refresh
                    </button>
                    <button className="btn-gradient vet-save-btn" onClick={saveProfile} disabled={saving}>
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="vet-footer-note">Uses GET/PATCH /users/me ✅</div>
          </div>
        </div>
      </section>
    </div>
  );
}