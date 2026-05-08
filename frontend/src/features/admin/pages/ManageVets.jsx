import EmptyState from "../../../components/common/EmptyState";

export default function ManageVets() {
  return (
    <div>
      <h2 className="fw-bold mb-3">Manage Vets</h2>
      <EmptyState title="No vets loaded yet" subtitle="Next we will connect adminApi.vets()." />
    </div>
  );
}