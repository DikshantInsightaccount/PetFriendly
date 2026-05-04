export default function AdminTable({ columns = [], rows = [] }) {
  return (
    <div className="glass admin-table">
      <table className="table mb-0">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="px-3 py-3">{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td className="px-3 py-4 text-muted" colSpan={columns.length}>
                No data available
              </td>
            </tr>
          ) : (
            rows.map((r, idx) => (
              <tr key={r.id ?? idx}>
                {columns.map((c) => (
                  <td key={c.key} className="px-3 py-3">
                    {String(r[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}