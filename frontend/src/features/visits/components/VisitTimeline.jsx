import GlassCard from "../../../components/common/GlassCard";

export default function VisitTimeline({ visits = [] }) {
  return (
    <GlassCard hover={false}>
      <div className="fw-bold mb-2">Upcoming Visits</div>

      {visits.length === 0 ? (
        <div className="text-muted">No upcoming visits.</div>
      ) : (
        <div className="d-grid gap-3">
          {visits.map((v, i) => (
            <div key={i} className="d-flex gap-3">
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 999,
                  marginTop: 6,
                  background: "var(--primary)",
                }}
              />
              <div>
                <div className="fw-semibold">{v.title}</div>
                <div className="text-muted small">{v.when}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}