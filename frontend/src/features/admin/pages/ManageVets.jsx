// src/pages/ManageVets.jsx// src/pages/ManageVets.jsxreact";
import AdminTable from "../components/AdminTable";
import { adminApi } from "../adminApi";
import {useState, useEffect, useMemo} from "react";

function randomPassword(len = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$!";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

export default function ManageVets() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    role: "VET",
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
  });

  const vets = useMemo(() => users.filter((u) => String(u.role) === "VET"), [users]);

  async function load() {
    setErr("");
    setMsg("");
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

  async function createVetUser() {
    setErr("");
    setMsg("");

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setErr("Name, Email and Password are required.");
      return;
    }

    try {
      const created = await adminApi.createUser({
        role: form.role, // "VET" or "ADMIN"
        name: form.name,
        email: form.email,
        phoneNumber: form.phoneNumber || null,
        address: form.address || null,
        password: form.password,
      });

      setMsg(`User created: ID=${created.id}. Now click "Create Vet Profile" to create Vet record.`);
      setForm((p) => ({ ...p, name: "", email: "", phoneNumber: "", address: "", password: "" }));
      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Create user failed");
    }
  }

  async function createVetProfile(userId) {
    setErr("");
    setMsg("");
    try {
      const vet = await adminApi.createVetProfile(userId);
      setMsg(`Vet profile created successfully. Vet ID = ${vet.vetId ?? vet.id ?? "?"}`);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Create vet profile failed");
    }
  }

  async function toggleStatus(userId) {
    setErr("");
    setMsg("");
    try {
      await adminApi.toggleUserStatus(userId);
      await load();
      setMsg("User status updated.");
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
      header: "Actions",
      thClassName: "text-end",
      tdClassName: "text-end",
      render: (u) => (
        <div className="d-flex gap-2 justify-content-end">
          <button className="btn btn-sm btn-outline-secondary" onClick={() => toggleStatus(u.id)}>
            {u.active ? "Disable" : "Enable"}
          </button>
          <button className="btn btn-sm btn-primary" onClick={() => createVetProfile(u.id)}>
            Create Vet Profile
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h3 className="fw-bold mb-3">Manage Vets</h3>

      {err && <div className="alert alert-danger">{err}</div>}
      {msg && <div className="alert alert-success">{msg}</div>}

      {/* Create Vet/Admin User */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <h5 className="fw-semibold mb-3">Create User (VET / ADMIN)</h5>

          <div className="row g-2">
            <div className="col-md-2">
              <label className="form-label">Role</label>
              <select
                className="form-select"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
              >
                <option value="VET">VET</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            <div className="col-md-3">
              <label className="form-label">Name *</label>
              <input
                className="form-control"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Email *</label>
              <input
                className="form-control"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Phone</label>
              <input
                className="form-control"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Password *</label>
              <input
                type="text"
                className="form-control"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Address</label>
              <input
                className="form-control"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />
            </div>

            <div className="col-md-12 d-flex gap-2 mt-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setForm({ ...form, password: randomPassword(10) })}
              >
                Generate Temp Password
              </button>
              <button className="btn btn-primary" onClick={createVetUser}>
                Create User
              </button>
              <button className="btn btn-outline-primary" onClick={load} disabled={loading}>
                Refresh List
              </button>
            </div>

            <div className="small text-muted mt-2">
              Flow: <code>POST /admin/users</code> → then <code>POST /vets?userId=...</code>
            </div>
          </div>
        </div>
      </div>

      {/* Vet Users Table */}
      <AdminTable
        title="Vet Users"
        subtitle="Users in AuthService with role = VET"
        loading={loading}
        error={err ? "" : ""} // handled above
        rows={vets}
        rowKey={(u) => u.id}
        columns={columns}
        rightAction={<span className="badge bg-primary">Total: {vets.length}</span>}
      />
    </div>
  );
}

