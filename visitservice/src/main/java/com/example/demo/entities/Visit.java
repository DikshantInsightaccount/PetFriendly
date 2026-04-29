package com.example.demo.entities;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "visits")
public class Visit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name="visit_id")
    private Long Id;
    @Column(name="appointment_id")
    private Long appointmentId;

    @Column(name="pet_id")
    private Long petId;

    private String diagnosis;
    private String treatment;
    private String prescription;
    private String notes;

    private LocalDateTime created_at;
    private LocalDateTime updated_at;

    public Long getId() {
        return Id;
    }

    public Long getPetId() {
        return petId;
    }

    public void setPetId(Long petId) {
        this.petId = petId;
    }

    public void setId(Long id) {
        Id = id;
    }

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(String diagnosis) {
        this.diagnosis = diagnosis;
    }

    public String getTreatment() {
        return treatment;
    }

    public void setTreatment(String treatment) {
        this.treatment = treatment;
    }

    public String getPrescription() {
        return prescription;
    }

    public void setPrescription(String prescription) {
        this.prescription = prescription;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(LocalDateTime updated_at) {
        this.updated_at = updated_at;
    }

    public Visit() {
    }

    public Visit(Long appointmentId, Long petId, String diagnosis, String treatment, String prescription, String notes, LocalDateTime created_at, LocalDateTime updated_at) {
        this.appointmentId = appointmentId;
        this.petId = petId;
        this.diagnosis = diagnosis;
        this.treatment = treatment;
        this.prescription = prescription;
        this.notes = notes;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }


}