export default function EmptyState({
  title = "No data available",
  subtitle = "",
}) {
  return (
    <div className="border rounded p-4 bg-white">
      <div className="fw-semibold">{title}</div>
      {subtitle ? (
        <div className="text-muted mt-1">{subtitle}</div>
      ) : null}
    </div>
  );
}