// src/pages/ManageOwners.jsx
import { useEffect, useMemo, useState } from "react";
import AdminTable from "../components/AdminTable";
import { adminApi } from "../adminApi";
import "../pages/manageowners.css";
 
export default function ManageOwners() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
 
  const owners = useMemo(
    () => users.filter((u) => String(u.role) === "OWNER"),
    [users]
  );
 
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
      setErr(
        e?.response?.data?.message ||
          e?.message ||
          "Toggle status failed"
      );
    }
  }
 
  useEffect(() => {
    load();
  }, []);
 
  const columns = [
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Phone", render: (u) => u.phoneNumber ?? "-" },
    {
      header: "Status",
      render: (u) => (
        <span className={u.active ? "status-active" : "status-inactive"}>
          {u.active ? "Active" : "Disabled"}
        </span>
      ),
    },
    {
      header: "Action",
      thClassName: "text-end",
      tdClassName: "text-end",
      render: (u) => (
        <button
          className={`btn btn-sm ${
            u.active ? "btn-danger-soft" : "btn-soft"
          }`}
          onClick={() => toggleStatus(u.userId)}
        >
          {u.active ? "Disable" : "Enable"}
        </button>
      ),
    },
  ];
 
  return (
    <div className="manage-owners-page">
      <div className="owners-container">
        <h3 className="page-title">Manage Owners</h3>
 
        {err && <div className="alert alert-danger">{err}</div>}
 
        <div className="glass-card">
          <AdminTable
            title="Owners"
            loading={loading}
            rows={owners}
            rowKey={(u) => u.userId}
            columns={columns}
            rightAction={
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={load}
                disabled={loading}
              >
                Refresh
              </button>
            }
          />
        </div>
      </div>
    </div>
  );
}