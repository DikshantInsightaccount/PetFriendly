
package com.petclinic.appointmentservice.dto;

import com.petclinic.appointmentservice.entity.AppointmentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateAppointmentStatusRequest {

    @NotNull
    private AppointmentStatus status;
}
