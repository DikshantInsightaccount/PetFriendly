export default function ServiceStep({ next }) {
  return (
    <div className="card">
      <h2>Select Service</h2>

      <button
        className="btn"
        onClick={() =>
          next({
            service: "Consultation",
            price: 500,
          })
        }
      >
        Consultation - ₹500
      </button>
    </div>
  );
}