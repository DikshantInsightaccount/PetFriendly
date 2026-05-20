// src/pages/ManageVisits.jsx
import { useEffect, useState } from "react";
import AdminTable from "../components/AdminTable";
import { adminApi } from "../adminApi";

export default function ManageVisits() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await adminApi.getAllVisitsAdmin();
      setRows(data);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Failed to load visits");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { header: "Visit ID", render: (v) => v.visitId ?? v.id ?? "-" },
    { header: "Pet", render: (v) => v.petId ?? "-" },
    { header: "Vet", render: (v) => v.vetId ?? "-" },
    { header: "Date", render: (v) => String(v.date ?? v.visitDate ?? "-").slice(0, 10) },
    { header: "Notes", render: (v) => v.description ?? v.notes ?? "-" },
  ];

  return (
    <div>
      <h3 className="fw-bold mb-3">Manage Visits</h3>
      <AdminTable
        title="Visits"
        subtitle="Admin view of clinical visits"
        loading={loading}
        error={err}
        rows={rows}
        rowKey={(v, i) => v.visitId ?? v.id ?? i}
        columns={columns}
        rightAction={
          <button className="btn btn-outline-primary btn-sm" onClick={load} disabled={loading}>
            Refresh
          </button>
        }
      />
    </div>
  );
}