import { Link } from "react-router-dom";

export default function Unauthorized() {
  return (
    <div style={{ padding: 24 }}>
      <h2>Unauthorized</h2>
      <p>You don’t have permission to access this page.</p>
      <Link to="/">Go Home</Link>
    </div>
  );
}
