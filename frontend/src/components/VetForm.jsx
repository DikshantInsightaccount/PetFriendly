import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../styles/home.css";

export default function VetForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  const isEdit = Boolean(id);

  const emptyForm = useMemo(
    () => ({
      name: "",
      email: "",
      phone: "",
      role: "VET",
      is_active: true,
    }),
    []
  );

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  // ✅ Load data for EDIT (when navigated with state)
  useEffect(() => {
    if (isEdit && location.state?.user) {
      setForm(location.state.user);
    } else if (!isEdit) {
      setForm(emptyForm);
    }
  }, [isEdit, location.state, emptyForm]);

  // ✅ tiny helper: validate (premium UX)
  const validate = () => {
    const e = {};
    if (!form.name?.trim()) e.name = "Name is required";
    if (!form.email?.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phone?.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a 10-digit phone number";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;

    if (isEdit) {
      console.log("Updating vet:", form);
    } else {
      console.log("Adding vet:", form);
    }
    navigate("/vets");
  };

  const handleCancel = () => navigate("/vets");

  return (
    <div className="home-wrapper vet-page">
      <section className="features-section">
        {/* ✅ center shell like VetList */}
        <div className="vet-shell">
          <div className="feature-card vet-card-premium vet-form-card">
            {/* ✨ Header (premium, centered) */}
            <div className="vet-form-header">
              <div className="vet-kicker">Pet Clinic • Admin</div>
              <h1 className="vet-title">{isEdit ? "Edit Veterinarian" : "Add Veterinarian"}</h1>
              <p className="vet-subtitle">
                {isEdit
                  ? "Update profile and contact details to keep appointments smooth."
                  : "Create a new veterinarian profile for your clinic team."}
              </p>
            </div>

            {/* ✅ Form Container (inner card) */}
            <div className="vet-form-inner">
              <div className="vet-form-grid">
                {/* Name */}
                <div className="vet-field">
                  <label className="vet-label">Full Name</label>
                  <input
                    className={`vet-input ${errors.name ? "vet-input-error" : ""}`}
                    placeholder="Dr. Jane Doe"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  {errors.name && <div className="vet-error">{errors.name}</div>}
                </div>

                {/* Email */}
                <div className="vet-field">
                  <label className="vet-label">Email</label>
                  <input
                    className={`vet-input ${errors.email ? "vet-input-error" : ""}`}
                    placeholder="jane@petclinic.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  {errors.email && <div className="vet-error">{errors.email}</div>}
                </div>

                {/* Phone */}
                <div className="vet-field">
                  <label className="vet-label">Phone</label>
                  <input
                    className={`vet-input ${errors.phone ? "vet-input-error" : ""}`}
                    placeholder="10-digit number"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  {errors.phone && <div className="vet-error">{errors.phone}</div>}
                </div>

                {/* Role */}
                <div className="vet-field">
                  <label className="vet-label">Role</label>
                  <select
                    className="vet-input vet-select"
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: e.target.value })}
                  >
                    <option value="VET">VET</option>
                    <option value="ADMIN">ADMIN</option>
                    
                  </select>
                  <div className="vet-hint">Usually set to <b>VET</b> for veterinarians.</div>
                </div>

                
              <div className="vet-field">
                <label className="vet-label">Speciality</label>
                <select
                  className="vet-input vet-select"
                  value={form.speciality}
                  onChange={(e) =>
                    setForm({ ...form, speciality: e.target.value })
                  }
                >
                  <option value="">Select Speciality</option>
                  <option value="GENERAL">General Care</option>
                  <option value="SURGERY">Surgery</option>
                  <option value="DENTAL">Dental Care</option>
                  <option value="DERMATOLOGY">Dermatology</option>
                  <option value="ORTHOPEDICS">Orthopedics</option>
                  <option value="CARDIOLOGY">Cardiology</option>
                </select>
                <div className="vet-hint">
                  Choose the vet’s primary area of expertise.
                </div>
              </div>


                {/* Active */}
                <div className="vet-field vet-field-full">
                  <label className="vet-toggle">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                    />
                    <span className="vet-toggle-ui" />
                    <span className="vet-toggle-text">
                      Active (available for appointments)
                    </span>
                  </label>

                  <div className="vet-status-row">
                    <span
                      className={`vet-status-premium ${
                        form.is_active ? "active" : "inactive"
                      }`}
                    >
                      {form.is_active ? "Active" : "Inactive"}
                    </span>
                    <span className="vet-muted">
                      {form.is_active
                        ? "Shown in appointment booking."
                        : "Hidden from booking until reactivated."}
                    </span>
                  </div>
                </div>
              </div>

              {/* ✅ Actions */}
              <div className="vet-form-actions">
                <button className="btn-outline-modern vet-cancel-btn" onClick={handleCancel}>
                  Cancel
                </button>

                <button className="btn-gradient vet-save-btn" onClick={handleSubmit}>
                  {isEdit ? "Save Changes" : "Create Vet"}
                </button>
              </div>
            </div>

            {/* ✨ Footer note */}
            <div className="vet-footer-note">
              Your Pet Clinic data stays consistent when vet profiles are accurate.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
