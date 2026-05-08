import EmptyState from "../../../components/common/EmptyState";

export default function VetsPage() {
  return (
    <div>
      <h2 className="fw-bold mb-3">Vets</h2>
      <EmptyState title="No vets loaded yet" subtitle="Next we will connect vetsApi to show real data." />
    </div>
  );
}