// src/components/AdminTable.jsx
export default function AdminTable({
  title,
  subtitle,
  loading,
  error,
  columns = [],
  rows = [],
  rowKey = (r, i) => r.id ?? i,
  rightAction,
  emptyText = "No records found.",
}) {
  return (
    <div className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex align-items-start justify-content-between mb-3">
          <div>
            <h5 className="fw-bold mb-1">{title}</h5>
            {subtitle && <div className="text-muted small">{subtitle}</div>}
          </div>
          {rightAction}
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {loading ? (
          <div className="text-muted">Loading…</div>
        ) : rows.length === 0 ? (
          <div className="text-muted">{emptyText}</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr>
                  {columns.map((c) => (
                    <th key={c.key || c.header} className={c.thClassName || ""}>
                      {c.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={rowKey(r, i)}>
                    {columns.map((c) => (
                      <td key={c.key || c.header} className={c.tdClassName || ""}>
                        {c.render ? c.render(r, i) : r[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
