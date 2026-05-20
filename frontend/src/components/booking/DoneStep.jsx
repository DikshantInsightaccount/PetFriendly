export default function DoneStep({ data }) {
  return (
    <div className="card">
      <h2>Booking Confirmed</h2>

      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
