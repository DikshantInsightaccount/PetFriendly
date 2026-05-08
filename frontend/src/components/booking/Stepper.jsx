export default function Stepper({ step }) {
  const steps = ["Service", "Time", "Details", "Payment", "Done"];

  return (
    <div className="stepper">
      {steps.map((s, index) => (
        <div key={index} className={step >= index + 1 ? "step active" : "step"}>
          {index + 1}. {s}
        </div>
      ))}
    </div>
  );
}