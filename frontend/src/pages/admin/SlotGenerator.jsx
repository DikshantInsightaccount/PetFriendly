import { useState } from "react";
import { api } from "../../api/axios";

export default function SlotGenerator() {
  const [payload, setPayload] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  async function submit() {
    setErr("");
    setMsg("");

    let body;
    try {
      body = JSON.parse(payload);
    } catch {
      setErr("Payload must be valid JSON.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/slots/generate", body);
      setMsg("Slots generated successfully.");
    } catch (e) {
      setErr(
        e?.response?.data?.message ||
          e?.response?.data?.error ||
          e?.message ||
          "Generate slots failed"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="fw-bold mb-3">Generate Slots (Admin)</h3>

      <div className="alert alert-info">
        Calls: <code>POST /slots/generate</code>. Paste the JSON required by{" "}
        <code>GenerateSlotsRequest</code>.
      </div>

      {err && <div className="alert alert-danger">{err}</div>}
      {msg && <div className="alert alert-success">{msg}</div>}

      <label className="form-label fw-semibold">GenerateSlotsRequest JSON</label>
      <textarea
        className="form-control"
        rows={10}
        value={payload}
        onChange={(e) => setPayload(e.target.value)}
        placeholder={`{\n  "..." : "Paste your GenerateSlotsRequest JSON here"\n}`}
      />

      <button className="btn btn-primary mt-3" onClick={submit} disabled={loading}>
        {loading ? "Generating..." : "Generate Slots"}
      </button>
    </div>
  );
}
