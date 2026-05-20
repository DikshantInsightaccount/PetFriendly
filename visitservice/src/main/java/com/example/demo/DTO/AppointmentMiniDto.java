package com.example.demo.DTO;

public record AppointmentMiniDto(
        Long appointmentId,
        Long petId,
        Long vetId,
        String status
) {}
