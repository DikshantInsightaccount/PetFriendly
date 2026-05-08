export default function TimeStep({ next, back }) {
  return (
    <div className="card">
      <h2>Select Time</h2>

      <button
        className="btn"
        onClick={() =>
          next({
            time: "10:30 AM",
            date: "2026-05-10",
          })
        }
      >
        10:30 AM
      </button>

      <div className="actions">
        <button onClick={back}>Back</button>
      </div>
    </div>
  );
}
``