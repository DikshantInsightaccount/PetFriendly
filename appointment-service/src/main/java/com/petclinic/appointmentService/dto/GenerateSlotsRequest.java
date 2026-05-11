package com.petclinic.appointmentService.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class GenerateSlotsRequest {
    @NotNull private Long vetId;
    @NotNull private LocalDate startDate;

    @NotNull @Min(1)
    private Integer days;

    @NotNull private LocalTime dayStartTime;
    @NotNull private LocalTime dayEndTime;

    @NotNull @Min(5)
    private Integer slotMinutes;
}
