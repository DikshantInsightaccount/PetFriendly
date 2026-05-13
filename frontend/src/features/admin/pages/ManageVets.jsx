import AdminTable from "../components/AdminTable";
import { adminApi } from "../adminApi";
import { useState, useEffect, useMemo } from "react";

function randomPassword(len = 10) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789@#$!";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

// ✅ normalize backend id shapes (id | userId | user_id)
function getUserId(u) {
  return u?.userId ?? u?.id ?? u?.user_id ?? null;
}

export default function ManageVets() {
  const [users, setUsers] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    role: "VET",
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    password: "",
    appointmentTypeIds: [],
  });

  const vets = useMemo(
    () => users.filter((u) => String(u.role).toUpperCase() === "VET"),
    [users]
  );

  async function load() {
    setErr("");
    setMsg("");
    setLoading(true);

    try {
      const [usersData, typesData] = await Promise.all([
        adminApi.getAllUsers(),
        adminApi.getAppointmentTypes(),
      ]);

      setUsers(Array.isArray(usersData) ? usersData : []);
      setAppointmentTypes(Array.isArray(typesData) ? typesData : []);
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const toggleType = (typeId) => {
  setForm((prev) => {
    const id = Number(typeId); // ✅ force number
    const exists = prev.appointmentTypeIds.includes(id);
    return {
      ...prev,
      appointmentTypeIds: exists
        ? prev.appointmentTypeIds.filter((x) => x !== id)
        : [...prev.appointmentTypeIds, id],
    };
  });
};

  async function createVetUser() {
    setErr("");
    setMsg("");

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setErr("Name, Email and Password are required.");
      return;
    }

    // ✅ require types only when creating a VET
    if (form.role === "VET" && form.appointmentTypeIds.length === 0) {
      setErr("Select at least one Appointment Type for this Vet.");
      return;
    }

    setSubmitting(true);
    try {
      // 1) Create user in AuthService
      const created = await adminApi.createUser({
        role: form.role,
        name: form.name.trim(),
        email: form.email.trim(),
        phoneNumber: form.phoneNumber?.trim() || null,
        address: form.address?.trim() || null,
        password: form.password,
      });

      const createdUserId = getUserId(created);
      if (!createdUserId) {
        throw new Error("User created but userId was not returned by backend.");
      }

      // 2) If role is VET: create vet_details + doctor_appointment_types in ONE call
      if (form.role === "VET") {
        const vet = await adminApi.createVetWithTypes(
          Number(createdUserId),
          form.appointmentTypeIds
        );

        const vetId = vet?.vetId ?? vet?.id ?? vet?.vet_id ?? "?";
        setMsg(`Vet created successfully ✅ UserID=${createdUserId}, VetID=${vetId}`);
      } else {
        setMsg(`User created successfully ✅ UserID=${createdUserId}`);
      }

      // reset form
      setForm((p) => ({
        ...p,
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        password: "",
        appointmentTypeIds: [],
      }));

      await load();
    } catch (e) {
      setErr(e?.response?.data?.message || e?.message || "Create user failed");
    } finally {
      setSubmitting(false);
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

  const columns = [
    {
      header: "User ID",
      render: (u) => getUserId(u) ?? "-",
    },
    { header: "Name", key: "name" },
    { header: "Email", key: "email" },
    { header: "Phone", render: (u) => u.phoneNumber ?? "-" },
    { header: "Active", render: (u) => (u.active ? "Yes" : "No") },
    {
      header: "Actions",
      thClassName: "text-end",
      tdClassName: "text-end",
      render: (u) => {
        const uid = getUserId(u);
        return (
          <div className="d-flex gap-2 justify-content-end">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => toggleStatus(uid)}
              disabled={!uid}
            >
              {u.active ? "Disable" : "Enable"}
            </button>
          </div>
        );
      },
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
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value, appointmentTypeIds: [] })
                }
                disabled={submitting}
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
                disabled={submitting}
              />
            </div>

            <div className="col-md-3">
              <label className="form-label">Email *</label>
              <input
                className="form-control"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={submitting}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Phone</label>
              <input
                className="form-control"
                value={form.phoneNumber}
                onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                disabled={submitting}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Password *</label>
              <input
                type="text"
                className="form-control"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                disabled={submitting}
              />
            </div>

            <div className="col-md-12">
              <label className="form-label">Address</label>
              <input
                className="form-control"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                disabled={submitting}
              />
            </div>

            {/* Appointment Type selection only for VET */}
            {form.role === "VET" && (
              <div className="col-md-12 mt-2">
                <div className="d-flex align-items-center justify-content-between">
                  <label className="form-label mb-1">Assign Appointment Types *</label>
                  <span className="badge bg-secondary">
                    Selected: {form.appointmentTypeIds.length}
                  </span>
                </div>

                <div className="d-flex flex-wrap gap-2">
                  {appointmentTypes.map((t) => {
                    const id =
                      t.appointmentTypeId ?? t.id ?? t.appointment_type_id;
                    const checked = form.appointmentTypeIds.includes(id);

                    return (
                      <label
                        key={id}
                        className="d-flex align-items-center gap-2 border rounded px-2 py-1"
                        style={{ cursor: "pointer" }}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleType(id)}
                          disabled={submitting}
                        />
                        <span>{t.name}</span>
                      </label>
                    );
                  })}
                </div>

                <div className="small text-muted mt-1">
                  This creates vet profile + mappings automatically (no Postman).
                </div>
              </div>
            )}

            <div className="col-md-12 d-flex gap-2 mt-2">
              <button
                className="btn btn-outline-secondary"
                onClick={() => setForm({ ...form, password: randomPassword(10) })}
                disabled={submitting}
              >
                Generate Temp Password
              </button>

              <button
                className="btn btn-primary"
                onClick={createVetUser}
                disabled={submitting}
              >
                {submitting
                  ? "Creating..."
                  : `Create ${form.role === "VET" ? "Vet (with Types)" : "User"}`}
              </button>

              <button
                className="btn btn-outline-primary"
                onClick={load}
                disabled={loading || submitting}
              >
                Refresh List
              </button>
            </div>

            <div className="small text-muted mt-2">
              Flow: <code>POST /admin/users</code> → <code>POST /vets</code> (JSON with
              appointmentTypeIds)
            </div>
          </div>
        </div>
      </div>

      {/* Vet Users Table */}
      <AdminTable
        title="Vet Users"
        subtitle="Users in AuthService with role = VET"
        loading={loading}
        error={""}
        rows={vets}
        rowKey={(u) => getUserId(u)}
        columns={columns}
        rightAction={
          <span className="badge bg-primary">Total: {vets.length}</span>
        }
      />
    </div>
  );
}
