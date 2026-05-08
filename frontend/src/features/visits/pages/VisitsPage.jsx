import EmptyState from "../../../components/common/EmptyState";

export default function VisitsPage() {
  return (
    <div>
      <h2 className="fw-bold mb-3">Visits</h2>
      <EmptyState title="No visits loaded yet" subtitle="Next we will connect visitsApi to show real data." />
    </div>
  );
}