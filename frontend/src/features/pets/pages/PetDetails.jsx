import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { api } from "../../../api/axios";
import { ENDPOINTS } from "../../../api/endpoints";

export default function PetDetails() {
  const { petId: routePetId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [pet, setPet] = useState(location.state?.pet ?? null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* -----------------------------
     ID NORMALIZATION (kept as-is)
     ----------------------------- */
  const normalizeId = (value) => {
    if (value === undefined || value === null) return null;
    const str = String(value).trim();
    if (!str || str === "undefined" || str === "null") return null;
    return str;
  };

  const petFromState = location.state?.pet ?? null;

  const petId =
    normalizeId(routePetId) ??
    normalizeId(
      petFromState?.petId ??
        petFromState?.id ??
        petFromState?.pet_id ??
        petFromState?._id
    ) ??
    normalizeId(
      pet?.petId ?? pet?.id ?? pet?.pet_id ?? pet?._id
    );

  /* -----------------------------
     EFFECT
     ----------------------------- */
  useEffect(() => {
    if (!user) return;

    // Redirect to canonical URL if pet came via state only
    if (
      !normalizeId(routePetId) &&
      petFromState &&
      normalizeId(
        petFromState?.petId ??
          petFromState?.id ??
          petFromState?.pet_id ??
          petFromState?._id
      )
    ) {
      const redirectId = normalizeId(
        petFromState?.petId ??
          petFromState?.id ??
          petFromState?.pet_id ??
          petFromState?._id
      );

      navigate(`/app/pets/${redirectId}`, {
        replace: true,
        state: { pet: petFromState },
      });
      return;
    }

    const loadPetDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        if (!pet && petId) {
          const resPet = await api.get(`${ENDPOINTS.PETS.BY_ID(petId)}`);
          setPet(resPet.data?.data ?? resPet.data);
        }

        if (!petId) {
          throw new Error(
            "Invalid pet identifier. Cannot load appointment history."
          );
        }

        const resVisits = await api.get(
          ENDPOINTS.VISITS.BY_PET(petId)
        );

        const visitData = resVisits.data?.data ?? resVisits.data;
        setVisits(Array.isArray(visitData) ? visitData : []);
      } catch (err) {
        console.error(err);
        setError(err.message || "Unable to load pet history.");
      } finally {
        setLoading(false);
      }
    };

    loadPetDetails();
  }, [petId, pet, user, routePetId, petFromState, navigate]);

  /* -----------------------------
     RENDER
     ----------------------------- */
  return (
    <div className="container py-4">
      <button
        className="btn btn-link mb-3"
        onClick={() => navigate("/app/pets")}
      >
        ← Back to pets
      </button>

      <div className="card mb-4 shadow-sm">
        <div className="card-body">
          <h2 className="fw-bold mb-2">
            {pet?.name || "Pet details"}
          </h2>

          <div className="text-muted mb-3">
            Review previous appointments and prescriptions for this pet.
          </div>

          {/* BASIC INFO */}
          <div className="row g-3 mb-3">
            <div className="col-md-3">
              <div className="text-uppercase text-muted small">Type</div>
              <div>{pet?.type || "—"}</div>
            </div>

            <div className="col-md-3">
              <div className="text-uppercase text-muted small">Breed</div>
              <div>{pet?.breed || "—"}</div>
            </div>

            <div className="col-md-3">
              <div className="text-uppercase text-muted small">Gender</div>
              <div>{pet?.gender || "—"}</div>
            </div>

            <div className="col-md-3">
              <div className="text-uppercase text-muted small">Birthday</div>
              <div>
                {pet?.birthday || pet?.dateOfBirth || pet?.dob
                  ? new Date(
                      pet?.birthday ||
                        pet?.dateOfBirth ||
                        pet?.dob
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : "—"}
              </div>
            </div>

            <div className="col-md-3">
              <div className="text-uppercase text-muted small">Status</div>
              <div>{pet?.isDeleted ? "Inactive" : "Active"}</div>
            </div>
          </div>

          {error && (
            <div className="alert alert-danger">{error}</div>
          )}
          {loading && (
            <div className="text-muted">
              Loading appointment history…
            </div>
          )}

          {/* VISITS */}
          {!loading && !error && (
            <div>
              <h4 className="fw-bold mb-3">Previous Appointments</h4>

              {visits.length === 0 ? (
                <div className="text-muted">
                  No appointments have happened yet for this pet.
                </div>
              ) : (
                visits.map((visit, index) => {
                  const visitDate =
                    visit.created_at ||
                    visit.createdAt ||
                    visit.created_date ||
                    visit.createdDate ||
                    visit.updated_at ||
                    visit.updatedAt ||
                    visit.updated_date ||
                    visit.updatedDate ||
                    visit.visitDate ||
                    visit.visit_date ||
                    visit.appointmentDate ||
                    visit.appointment_date ||
                    visit.date ||
                    null;

                  const formattedDate = visitDate
                    ? new Date(visitDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Date unknown";

                  return (
                    <div
                      key={visit.visitId ?? visit.id ?? index}
                      className="card mb-3"
                    >
                      <div className="card-body">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <div className="fw-semibold">
                              {`Appointment #${
                                visit.appointment_id ??
                                visit.visitId ??
                                index + 1
                              }`}
                            </div>
                            <div className="text-muted small">
                              {formattedDate}
                            </div>
                          </div>

                          <span className="badge bg-secondary">
                            Completed
                          </span>
                        </div>

                        <div className="row g-3">
                          <div className="col-md-6">
                            <div className="text-uppercase text-muted small">
                              Diagnosis
                            </div>
                            <div>{visit.diagnosis || "—"}</div>
                          </div>

                          <div className="col-md-6">
                            <div className="text-uppercase text-muted small">
                              Prescription
                            </div>
                            <div>{visit.prescription || "—"}</div>
                          </div>

                          <div className="col-md-6">
                            <div className="text-uppercase text-muted small">
                              Treatment
                            </div>
                            <div>{visit.treatment || "—"}</div>
                          </div>

                          <div className="col-md-6">
                            <div className="text-uppercase text-muted small">
                              Notes
                            </div>
                            <div>{visit.notes || "—"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
