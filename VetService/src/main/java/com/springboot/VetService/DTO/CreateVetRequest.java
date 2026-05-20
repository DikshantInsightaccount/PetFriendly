package com.springboot.VetService.DTO;

import java.util.List;

public class CreateVetRequest {
    private Long userId;
    private List<Long> appointmentTypeIds;

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public List<Long> getAppointmentTypeIds() { return appointmentTypeIds; }
    public void setAppointmentTypeIds(List<Long> appointmentTypeIds) { this.appointmentTypeIds = appointmentTypeIds; }
}