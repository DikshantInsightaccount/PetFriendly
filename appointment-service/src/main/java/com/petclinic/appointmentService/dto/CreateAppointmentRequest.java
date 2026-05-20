package com.petclinic.appointmentService.dto;

import com.petclinic.appointmentService.entity.AppointmentMode;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CreateAppointmentRequest {

    @NotNull private Long petId;
    @NotNull private Long vetId;
    @NotNull private Long appointmentTypeId;
    @NotNull private Long slotId;

    @NotNull private AppointmentMode appointmentMode;

}
