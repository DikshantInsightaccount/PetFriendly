// src/pages/ManageOwners.jsx
import { useEffect, useMemo, useState } from "react";
import AdminTable from "../components/AdminTable";
import { adminApi } from "../adminApi";

export default function ManageOwners() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const owners = useMemo(() => users.filter((u) => String(u.role) === "OWNER"), [users]);

  async function load() {
    setErr("");
    setLoading(true);
    try {
      const data = await adminApi.getAllUsers();
      setUsers(data);
    } catch (e) {
      setErr(e?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  async function toggleStatus(userId) {
    setErr("");
    try {
      await adminApi.toggleUserStatus(userId);
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Toggle status failed");
    }
  }

  useEffect(() => {
    load();
  }, []);

  const columns = [
    { header: "User ID", key: "id" },
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Phone", render: (u) => u.phoneNumber ?? "-" },
    { header: "Active", render: (u) => (u.active ? "Yes" : "No") },
    {
      header: "Action",
      thClassName: "text-end",
      tdClassName: "text-end",
      render: (u) => (
        <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleStatus(u.id)}>
          {u.active ? "Disable" : "Enable"}
        </button>
      ),
    },
  ];

  return (
    <div>
      <h3 className="fw-bold mb-3">Manage Owners</h3>
      <AdminTable
        title="Owners"
        subtitle="All users with role = OWNER (registered users)"
        loading={loading}
        error={err}
        rows={owners}
        rowKey={(u) => u.id}
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
