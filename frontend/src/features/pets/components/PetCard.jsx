import GlassCard from "../../../components/common/GlassCard";

export default function PetCard({ pet, onClick, onDelete }) {
  return (
    <GlassCard
      className="h-100"
      style={{ cursor: onClick ? "pointer" : "default" }}
      onClick={onClick}
    >
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <div className="fw-bold fs-5">
            {pet?.name || "Pet"}
          </div>
          <div className="text-muted">
            {pet?.type || "Type"}
          </div>
        </div>
      </div>

      <div className="mt-3 text-muted small">
        {pet?.note || "Tap for details and appointment history."}
      </div>

      <div className="d-flex justify-content-end mt-3">
        <button
          className="btn btn-sm btn-outline-danger"
          onClick={(e) => {
            e.stopPropagation(); 
            onDelete?.();
          }}
        >
          Delete
        </button>
      </div>


    </GlassCard>
  );
}