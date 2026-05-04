import EmptyState from "../../../components/common/EmptyState";

export default function ManageVisits() {
  return (
    <div>
      <h2 className="fw-bold mb-3">Manage Visits</h2>
      <EmptyState title="No visits loaded yet" subtitle="Next we will connect adminApi.visits()." />
    </div>
  );
}