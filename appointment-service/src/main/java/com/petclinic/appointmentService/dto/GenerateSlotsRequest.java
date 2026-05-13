package com.petclinic.appointmentService.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerateSlotsRequest {

    @NotNull
    private Long vetId;

    @NotNull
    private LocalDate startDate;

    // for 4 weeks => 28
    @NotNull
    @Min(1)
    private Integer days;

    @NotNull
    @Min(5)
    private Integer slotMinutes;
}