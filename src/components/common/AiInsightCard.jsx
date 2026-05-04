import GlassCard from "./GlassCard";

export default function AiInsightCard({ greeting, points = [], suggestion }) {
  return (
    <GlassCard hover={false}>
      <div className="d-flex align-items-center justify-content-between">
        <div>
          <div className="fw-bold">{greeting || "Hello 👋"}</div>
          <div className="text-muted small">AI insights tailored for you</div>
        </div>
        <span
          className="px-3 py-1 rounded-pill"
          style={{
            background: "var(--primary-soft)",
            color: "var(--primary)",
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          INSIGHT
        </span>
      </div>

      <ul className="mt-3 mb-0 text-muted">
        {points.slice(0, 3).map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>

      {suggestion ? (
        <div className="mt-3 p-3 rounded" style={{ background: "rgba(76,175,147,0.10)" }}>
          <div className="fw-semibold" style={{ color: "var(--secondary)" }}>
            Suggested action
          </div>
          <div className="text-muted small">{suggestion}</div>
        </div>
      ) : null}
    </GlassCard>
  );
}