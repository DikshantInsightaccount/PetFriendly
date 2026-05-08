export default function PaymentStep({ next, back }) {
  return (
    <div className="card">
      <h2>Payment</h2>

      <p>Demo Payment ✅</p>

      <div className="actions">
        <button onClick={back}>Back</button>
        <button onClick={() => next({ payment: "Success" })}>
          Pay
        </button>
      </div>
    </div>
  );
}
