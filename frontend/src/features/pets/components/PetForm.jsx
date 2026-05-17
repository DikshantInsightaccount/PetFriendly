import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { petsApi } from "../../../api/modules/pets.api";

export default function PetForm({ onPetAdded }) {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: "",
    type: "",
    breed: "",
    gender: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (!user) {
    return (
      <div className="alert alert-warning">
        Please log in to add pets.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const newPet = await petsApi.createPet(form);

      onPetAdded?.(newPet);

      setForm({
        name: "",
        type: "",
        breed: "",
        gender: "",
        dateOfBirth: "",
      });
    } catch (err) {
      console.error("Failed to add pet", err);
      setError(err.message || "Failed to add pet.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="card mb-4 shadow-sm">
      <div className="card-body">
        {error && (
          <div className="alert alert-danger mb-3">
            {error}
          </div>
        )}

        <h5 className="fw-bold mb-3">Add a Pet</h5>

        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-3">
            <label className="form-label">Name</label>
            <input
              className="form-control"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Type</label>
            <input
              className="form-control"
              value={form.type}
              placeholder="Dog, Cat..."
              onChange={(e) =>
                setForm({ ...form, type: e.target.value })
              }
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Breed</label>
            <input
              className="form-control"
              value={form.breed}
              onChange={(e) =>
                setForm({ ...form, breed: e.target.value })
              }
            />
          </div>
          <div className="col-md-3">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-control"
              value={form.dateOfBirth}
              onChange={(e) =>
                setForm({ ...form, dateOfBirth: e.target.value })
              }
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Gender</label>
            <select
              className="form-select"
              value={form.gender}
              onChange={(e) =>
                setForm({ ...form, gender: e.target.value })
              }
            >
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
            </select>
          </div>

          <div className="col-12">
            <button
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Adding…" : "Add Pet"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
