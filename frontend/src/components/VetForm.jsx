// src/components/VetForm.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
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
      speciality: "",
      is_active: true,
    }),
    []
  );

  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});

  /* ---------- load edit data safely ---------- */
  useEffect(() => {
    if (isEdit && location.state?.user) {
      setForm({
        ...emptyForm,
        ...location.state.user,
      });
    } else {
      setForm(emptyForm);
    }
  }, [isEdit, location.state, emptyForm]);

  /* ---------- validation ---------- */
  const validate = () => {
    const e = {};

    if (!form.name.trim()) e.name = "Name is required";

    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Invalid email format";

    if (!form.phone.trim()) e.phone = "Phone is required";
    else if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter 10-digit phone number";

    if (!form.speciality) e.speciality = "Speciality is required";

    return e;
  };

  /* ---------- submit ---------- */
  const handleSubmit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length > 0) return;


    navigate("/vets");
  };

  return (
    <div className="home-wrapper vet-page">
      <section className="features-section">
        <div className="vet-shell">
          <div className="feature-card vet-card-premium vet-form-card">
            <div className="vet-form-header">
              <div className="vet-kicker">Pet Clinic • Admin</div>
              <h1 className="vet-title">
                {isEdit ? "Edit Veterinarian" : "Add Veterinarian"}
              </h1>
              <p className="vet-subtitle">
                Maintain veterinarian profile and clinic expertise.
              </p>
            </div>

            <div className="vet-form-inner">
              <div className="vet-form-grid">
                {/* Name */}
                <div className="vet-field">
                  <label className="vet-label">Full Name</label>
                  <input
                    className={`vet-input ${errors.name ? "vet-input-error" : ""}`}
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                  />
                  {errors.name && <div className="vet-error">{errors.name}</div>}
                </div>

                {/* Email */}
                <div className="vet-field">
                  <label className="vet-label">Email</label>
                  <input
                    className={`vet-input ${errors.email ? "vet-input-error" : ""}`}
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                  />
                  {errors.email && <div className="vet-error">{errors.email}</div>}
                </div>

                {/* Phone */}
                <div className="vet-field">
                  <label className="vet-label">Phone</label>
                  <input
                    className={`vet-input ${errors.phone ? "vet-input-error" : ""}`}
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                  />
                  {errors.phone && <div className="vet-error">{errors.phone}</div>}
                </div>

                {/* Speciality */}
                <div className="vet-field">
                  <label className="vet-label">Speciality</label>
                  <select
                    className={`vet-input vet-select ${
                      errors.speciality ? "vet-input-error" : ""
                    }`}
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
                  {errors.speciality && (
                    <div className="vet-error">{errors.speciality}</div>
                  )}
                </div>

                {/* Active */}
                <div className="vet-field vet-field-full">
                  <label className="vet-toggle">
                    <input
                      type="checkbox"
                      checked={form.is_active}
                      onChange={(e) =>
                        setForm({ ...form, is_active: e.target.checked })
                      }
                    />
                    <span className="vet-toggle-ui" />
                    <span className="vet-toggle-text">
                      Active (available for appointments)
                    </span>
                  </label>
                </div>
              </div>

              <div className="vet-form-actions">
                <button
                  className="btn-outline-modern vet-cancel-btn"
                  onClick={() => navigate("/vets")}
                >
                  Cancel
                </button>

                <button
                  className="btn-gradient vet-save-btn"
                  onClick={handleSubmit}
                >
                  {isEdit ? "Save Changes" : "Create Vet"}
                </button>
              </div>
            </div>

            <div className="vet-footer-note">
              Vet profiles stay consistent with clinic scheduling.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}