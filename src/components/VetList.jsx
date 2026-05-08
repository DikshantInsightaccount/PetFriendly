// src/components/VetList.jsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../styles/home.css";

function VetList() {
  const navigate = useNavigate();

  const [vets] = useState([
    {
      vet_id: 1,
      user: {
        name: "Dr. Alice",
        email: "alice@petclinic.com",
        phone: "8888888888",
        role: "VET",
        is_active: true,
      },
    },
    {
      vet_id: 2,
      user: {
        name: "Dr. Bob",
        email: "bob@petclinic.com",
        phone: "7777777777",
        role: "VET",
        is_active: true,
      },
    },
  ]);

  return (
    <div className="home-wrapper vet-page">
      <section className="features-section">
        <div className="vet-shell">
          <div className="feature-card vet-card-premium">
            {/* ✨ CENTERED HEADER */}
            <div className="vet-header-premium">
              <div className="vet-title-block">
                <div className="vet-kicker">Pet Clinic • Admin</div>
                <h1 className="vet-title">Veterinarians</h1>
                <p className="vet-subtitle">
                  Trusted professionals caring for pets with compassion.
                </p>
              </div>

              <div className="vet-actions">
                <button
                  className="btn-gradient vet-add-btn-premium"
                  onClick={() => navigate("/vets/add")}
                >
                  + Add Vet
                </button>
              </div>
            </div>

            {/* 🧾 PREMIUM TABLE CONTAINER */}
            <div className="vet-table-card">
              <div className="vet-table-top">
                <div className="vet-table-meta">
                  <span className="vet-pill">Total Vets: {vets.length}</span>
                  <span className="vet-dot" />
                  <span className="vet-muted">Manage profiles & contact info</span>
                </div>
              </div>

              <div className="vet-table-wrap">
                <table className="vet-table-premium">
                  <thead>
                    <tr>
                      <th>Vet</th>
                      <th>Contact</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>

                  <tbody>
                    {vets.map((v) => (
                      <tr key={v.vet_id}>
                        <td>
                          <div className="vet-identity">
                            <div className="vet-avatar">
                              {v.user.name?.charAt(0)}
                            </div>
                            <div>
                              <div className="vet-name">{v.user.name}</div>
                              <div className="vet-role">{v.user.role}</div>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="vet-contact">
                            <div className="vet-email">{v.user.email}</div>
                            <div className="vet-phone">{v.user.phone}</div>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`vet-status-premium ${
                              v.user.is_active ? "active" : "inactive"
                            }`}
                          >
                            {v.user.is_active ? "Active" : "Inactive"}
                          </span>
                        </td>

                        <td className="text-right">
                          <button
                            className="btn-outline-modern small vet-edit-btn"
                            onClick={() =>
                              navigate(`/vets/edit/${v.vet_id}`, { state: v })
                            }
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {vets.length === 0 && (
                  <div className="empty-state-premium">
                    <div className="empty-emoji">🐶</div>
                    <div className="empty-title">No vets added yet</div>
                    <div className="empty-sub">
                      Add your first veterinarian to begin managing the clinic.
                    </div>
                    <button
                      className="btn-gradient vet-add-btn-premium"
                      onClick={() => navigate("/vets/add")}
                    >
                      + Add Vet
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* ✨ FOOTNOTE */}
            <div className="vet-footer-note">
              Tip: Keep vet contact info updated for smoother appointments and follow-ups.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default VetList;
