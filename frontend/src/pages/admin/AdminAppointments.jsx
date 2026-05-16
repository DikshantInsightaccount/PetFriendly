import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../../features/admin/adminApi";
import { api } from "../../api/axios";
import { ENDPOINTS } from "../../api/endpoints";
import "../../styles/admin-appointments.css";

export default function AdminAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [vetSummaries, setVetSummaries] = useState([]);
  const [petMap, setPetMap] = useState({}); // petId -> {name,type,breed}
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedVetId, setSelectedVetId] = useState(null);

  useEffect(() => {
    loadEverything();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadEverything() {
    try {
      setLoading(true);
      setError("");

      // 1) fetch all appointments (admin)
      const appts = await adminApi.getAllAppointmentsAdmin();
      const apptArray = Array.isArray(appts) ? appts : [];
      setAppointments(apptArray);

      // 2) fetch vet summaries (vetId + name)
      const vets = await adminApi.getVetSummaries().catch(() => []);
      setVetSummaries(Array.isArray(vets) ? vets : []);

      // 3) fetch pet names for unique petIds (cached map)
      const uniquePetIds = Array.from(
        new Set(apptArray.map((a) => a?.petId).filter(Boolean))
      );

      if (uniquePetIds.length === 0) {
        setPetMap({});
        return;
      }

      // fetch pets in parallel, but avoid re-fetch if already cached
      const results = await Promise.allSettled(
        uniquePetIds.map(async (pid) => {
          // skip if already in map (important when reload)
          if (petMap[pid]) return { petId: pid, pet: petMap[pid] };

          const res = await api.get(ENDPOINTS.PETS.BY_ID(pid));
          const p = res.data?.data ?? res.data;
          return {
            petId: pid,
            pet: {
              name: p?.name ?? `Pet #${pid}`,
              type: p?.type ?? "",
              breed: p?.breed ?? "",
            },
          };
        })
      );

      const nextPetMap = { ...petMap };
      results.forEach((r) => {
        if (r.status === "fulfilled" && r.value?.petId) {
          nextPetMap[r.value.petId] = r.value.pet;
        }
      });

      setPetMap(nextPetMap);
    } catch (e) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  // Build vet map: vetId -> displayName
  const vetNameById = useMemo(() => {
    const map = {};
    (vetSummaries || []).forEach((v) => {
      const id = v?.vetId ?? v?.id ?? v?.vet_id;
      if (!id) return;
      const name = v?.name ?? v?.vetName ?? v?.email ?? `Vet #${id}`;
      map[id] = name;
    });
    return map;
  }, [vetSummaries]);

  // Enrich appointments with petName + vetName
  const enrichedAppointments = useMemo(() => {
    return (appointments || []).map((a) => {
      const petId = a?.petId;
      const vetId = a?.vetId;
      return {
        ...a,
        petName: petMap?.[petId]?.name ?? `Pet #${petId ?? "—"}`,
        vetName: vetNameById?.[vetId] ?? `Vet #${vetId ?? "—"}`,
      };
    });
  }, [appointments, petMap, vetNameById]);

  // Group by vet
  const vetGroups = useMemo(() => {
    const groups = {};
    enrichedAppointments.forEach((a) => {
      const vetId = a?.vetId;
      if (!vetId) return;
      if (!groups[vetId]) {
        groups[vetId] = {
          vetId,
          vetName: a?.vetName ?? `Vet #${vetId}`,
          count: 0,
          appointments: [],
        };
      }
      groups[vetId].count += 1;
      groups[vetId].appointments.push(a);
    });

    // sort vets by count desc
    return Object.values(groups).sort((x, y) => y.count - x.count);
  }, [enrichedAppointments]);

  // Selected vet’s appointments
  const selectedVetAppointments = useMemo(() => {
    if (!selectedVetId) return [];
    const group = vetGroups.find((g) => String(g.vetId) === String(selectedVetId));
    if (!group) return [];
    // sort latest first if appointmentId increments
    return [...group.appointments].sort(
      (a, b) => (b.appointmentId ?? 0) - (a.appointmentId ?? 0)
    );
  }, [selectedVetId, vetGroups]);

  if (loading) return <div className="admin-loading">Loading appointments…</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="admin-appointments">
      {/* Header */}
      <div className="page-header">
        <h2>All Appointments</h2>
        <p className="subtitle">
          Click a vet to drill down into appointment details.
        </p>
      </div>

      {/* If no appointments */}
      {enrichedAppointments.length === 0 ? (
        <div className="empty-state">No appointments found.</div>
      ) : (
        <>
          {/* Vet list view */}
          {!selectedVetId && (
            <div className="vet-grid">
              {vetGroups.map((g) => (
                <button
                  key={g.vetId}
                  className="vet-card"
                  onClick={() => setSelectedVetId(g.vetId)}
                  type="button"
                >
                  <div className="vet-card-top">
                    <div className="vet-avatar">
                      {(g.vetName || "V")[0]?.toUpperCase()}
                    </div>
                    <div className="vet-meta">
                      <div className="vet-name">{g.vetName}</div>
                      <div className="vet-sub">Vet ID: {g.vetId}</div>
                    </div>
                  </div>

                  <div className="vet-card-bottom">
                    <span className="vet-count">{g.count}</span>
                    <span className="vet-count-label">Appointments</span>
                    <span className="vet-open">Open →</span>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* Drill-down view */}
          {selectedVetId && (
            <div className="table-card">
              <div className="table-toolbar">
                <button
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => setSelectedVetId(null)}
                  type="button"
                >
                  ← Back to Vets
                </button>

                <div className="toolbar-title">
                  {vetNameById[selectedVetId] ?? `Vet #${selectedVetId}`}
                </div>

                <div className="toolbar-pill">
                  {selectedVetAppointments.length} appointments
                </div>
              </div>

              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Appointment ID</th>
                    <th>Pet</th>
                    <th>Status</th>
                  </tr>
                </thead>

                <tbody>
                  {selectedVetAppointments.map((a) => (
                    <tr key={a.appointmentId}>
                      <td className="mono">{a.appointmentId}</td>
                      <td>
                        <div className="pet-cell">
                          <div className="pet-name">{a.petName}</div>
                          <div className="pet-sub">Pet ID: {a.petId}</div>
                        </div>
                      </td>
                      <td>
                        <span className={`status ${a.status?.toLowerCase()}`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}