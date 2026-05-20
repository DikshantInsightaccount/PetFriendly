import { useState } from "react";

export default function DetailsStep({ next, back }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="card">
      <h2>Enter Details</h2>

      <input
        name="name"
        placeholder="Full Name"
        onChange={handleChange}
      />

      <input
        name="phone"
        placeholder="Phone"
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        onChange={handleChange}
      />

      <textarea
        name="notes"
        placeholder="Notes"
        onChange={handleChange}
      />

      <div className="actions">
        <button onClick={back}>Back</button>
        <button onClick={() => next(form)}>Next</button>
      </div>
    </div>
  );
}