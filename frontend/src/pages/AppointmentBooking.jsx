import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Stepper from "../components/booking/Stepper";
import ServiceStep from "../components/booking/ServiceStep";
import TimeStep from "../components/booking/TimeStep";
import DetailsStep from "../components/booking/DetailsStep";
import PaymentStep from "../components/booking/PaymentStep";
import DoneStep from "../components/booking/DoneStep";

import "../assets/css/booking.css";

export default function AppointmentBooking() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const next = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
    setStep((prev) => prev + 1);
  };

  const back = () => setStep((prev) => prev - 1);

  return (
    <div className="booking-container">
      {/* ✅ GLOBAL NAV (works on every step) */}
      <div className="top-nav">
        <button className="btn btn-secondary-lite" onClick={() => navigate(-1)}>
          ⬅ Back
        </button>

        <button className="btn btn-secondary-lite" onClick={() => navigate("/")}>
          ⌂ Home
        </button>
      </div>

      <Stepper step={step} />

      {step === 1 && <ServiceStep next={next} />}
      {step === 2 && <TimeStep next={next} back={back} />}
      {step === 3 && <DetailsStep next={next} back={back} />}
      {step === 4 && <PaymentStep next={next} back={back} />}
      {step === 5 && <DoneStep data={formData} />}
    </div>
  );
}