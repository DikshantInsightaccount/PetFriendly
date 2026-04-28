package com.springboot.VetService.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointment_types")
public class AppointmentType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long appointmentTypeId;

    private String name;
    private Integer expectedDuration;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AppointmentType() {
    }

    public AppointmentType(Long appointmentTypeId, String name,
                           Integer expectedDuration,
                           LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.appointmentTypeId = appointmentTypeId;
        this.name = name;
        this.expectedDuration = expectedDuration;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getAppointmentTypeId() {
        return appointmentTypeId;
    }

    public void setAppointmentTypeId(Long appointmentTypeId) {
        this.appointmentTypeId = appointmentTypeId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getExpectedDuration() {
        return expectedDuration;
    }

    public void setExpectedDuration(Integer expectedDuration) {
        this.expectedDuration = expectedDuration;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
