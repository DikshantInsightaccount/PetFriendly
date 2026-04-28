package com.springboot.VetService.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "doctor_appointment_types")
public class DoctorAppointmentType {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id", nullable = false)
    private Vet vet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "appointment_type_id", nullable = false)
    private AppointmentType appointmentType;

    private LocalDateTime createdAt;

    public DoctorAppointmentType() {
    }

    public DoctorAppointmentType(Long id, Vet vet,
                                 AppointmentType appointmentType,
                                 LocalDateTime createdAt) {
        this.id = id;
        this.vet = vet;
        this.appointmentType = appointmentType;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Vet getVet() {
        return vet;
    }

    public void setVet(Vet vet) {
        this.vet = vet;
    }

    public AppointmentType getAppointmentType() {
        return appointmentType;
    }

    public void setAppointmentType(AppointmentType appointmentType) {
        this.appointmentType = appointmentType;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}