
package com.petclinic.appointmentService.dto;

import com.petclinic.appointmentService.entity.AppointmentStatus;
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
