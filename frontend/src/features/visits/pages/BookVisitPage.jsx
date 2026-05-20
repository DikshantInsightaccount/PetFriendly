import EmptyState from "../../../components/common/EmptyState";

export default function BookVisitPage() {
  return (
    <div>
      <h2 className="fw-bold mb-3">Book a Visit</h2>
      <EmptyState title="Booking UI pending" subtitle="Next we will connect slots + appointment types from backend." />
    </div>
  );
}