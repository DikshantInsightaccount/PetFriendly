package com.petclinic.appointmentService.dto;

import com.petclinic.appointmentService.entity.AppointmentMode;
import com.petclinic.appointmentService.entity.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class AppointmentResponse {

    private Long appointmentId;

    private Long petId;
    private Long vetId;
    private Long appointmentTypeId;

    private Long slotId;
    private LocalDate slotDate;
    private LocalTime slotStartTime;
    private LocalTime slotEndTime;

    private AppointmentMode appointmentMode;
    private AppointmentStatus status;

    private LocalDateTime actualStartTime;
    private LocalDateTime actualEndTime;

    private LocalDateTime createdAt;

}
