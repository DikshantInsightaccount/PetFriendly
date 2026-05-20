export default function Loader({ label = "Loading..." }) {
  return (
    <div className="container py-5 text-center">
      <div className="spinner-border" role="status" />
      <div className="text-muted mt-3">{label}</div>
    </div>
  );
}