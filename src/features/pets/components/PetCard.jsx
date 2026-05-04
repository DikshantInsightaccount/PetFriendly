import GlassCard from "../../../components/common/GlassCard";

export default function PetCard({ pet }) {
  const status = pet?.status || "Unknown";
  const healthy = status.toLowerCase().includes("healthy");

  return (
    <GlassCard className="h-100">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="fw-bold fs-5">
            {pet?.name || "Pet"}
          </div>
          <div className="text-muted">
            {pet?.type || "Type"}
          </div>
        </div>

        <span
          className="px-3 py-1 rounded-pill"
          style={{
            background: healthy
              ? "var(--secondary-soft)"
              : "var(--accent-soft)",
            color: healthy
              ? "var(--secondary)"
              : "#8a5a00",
            fontWeight: 600,
            fontSize: 13,
          }}
        >
          {status}
        </span>
      </div>

      <div className="mt-3 text-muted small">
        {pet?.note || "Tap for details and upcoming visits."}
      </div>
    </GlassCard>
  );
}