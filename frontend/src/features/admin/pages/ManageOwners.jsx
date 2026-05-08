import EmptyState from "../../../components/common/EmptyState";

export default function ManageOwners() {
  return (
    <div>
      <h2 className="fw-bold mb-3">Manage Owners</h2>
      <EmptyState title="No owners loaded yet" subtitle="Next we will connect adminApi.owners()." />
    </div>
  );
}