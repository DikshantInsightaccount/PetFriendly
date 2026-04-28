package com.petclinic.appointmentservice.dto;

import com.petclinic.appointmentservice.entity.AppointmentMode;
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
