import EmptyState from "../../../components/common/EmptyState";

export default function AdminDashboard() {
  return (
    <div>
      <h2 className="fw-bold mb-3">Admin Dashboard</h2>
      <EmptyState title="No metrics loaded yet" subtitle="Next we will connect adminApi.dashboard()." />
    </div>
  );
}