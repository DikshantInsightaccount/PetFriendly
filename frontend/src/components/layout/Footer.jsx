export default function Footer() {
  return (
    <footer
      className="footer-premium"
      style={{
        marginTop: "auto",
        backdropFilter: "blur(10px)",
        background: "rgba(255,255,255,0.7)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "18px 16px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "13.5px",
          color: "#666",
          letterSpacing: "0.2px",
        }}
      >
        © {new Date().getFullYear()} <span style={{ margin: "0 6px" }}>PawCare</span>
        <span style={{ opacity: 0.6 }}>
          — Modern pet healthcare experience 🐾
        </span>
      </div>
    </footer>
  );
}