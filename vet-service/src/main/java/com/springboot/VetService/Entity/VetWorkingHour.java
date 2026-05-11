package com.springboot.VetService.Entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "vet_working_hours")
public class VetWorkingHour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long workingHourId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id", nullable = false)
    private Vet vet;

    private String dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public VetWorkingHour() {
    }

    public VetWorkingHour(Long workingHourId, Vet vet, String dayOfWeek,
                          LocalTime startTime, LocalTime endTime,
                          LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.workingHourId = workingHourId;
        this.vet = vet;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getWorkingHourId() {
        return workingHourId;
    }

    public void setWorkingHourId(Long workingHourId) {
        this.workingHourId = workingHourId;
    }

    public Vet getVet() {
        return vet;
    }

    public void setVet(Vet vet) {
        this.vet = vet;
    }

    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
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
