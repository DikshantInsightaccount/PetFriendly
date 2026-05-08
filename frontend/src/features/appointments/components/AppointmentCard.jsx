import React from "react";
import GlassCard from "../../../components/common/GlassCard";

export default function AppointmentCard({ appointment }) {
  return (
    <GlassCard className="mb-3">
      <h4>{appointment.petName}</h4>
      <p>{appointment.appointmentType}</p>
      <p>
        {appointment.date} | {appointment.startTime} - {appointment.endTime}
      </p>
      <p>Status: {appointment.status}</p>
    </GlassCard>
  );
}
