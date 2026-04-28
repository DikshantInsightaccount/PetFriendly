package com.springboot.VetService.Entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "vet_leaves")
public class VetLeave {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long leaveId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vet_id", nullable = false)
    private Vet vet;

    private LocalDate fromDate;
    private LocalDate toDate;
    private String reason;

    private LocalDateTime createdAt;

    public VetLeave() {
    }

    public VetLeave(Long leaveId, Vet vet,
                    LocalDate fromDate, LocalDate toDate,
                    String reason, LocalDateTime createdAt) {
        this.leaveId = leaveId;
        this.vet = vet;
        this.fromDate = fromDate;
        this.toDate = toDate;
        this.reason = reason;
        this.createdAt = createdAt;
    }

    public Long getLeaveId() {
        return leaveId;
    }

    public void setLeaveId(Long leaveId) {
        this.leaveId = leaveId;
    }

    public Vet getVet() {
        return vet;
    }

    public void setVet(Vet vet) {
        this.vet = vet;
    }

    public LocalDate getFromDate() {
        return fromDate;
    }

    public void setFromDate(LocalDate fromDate) {
        this.fromDate = fromDate;
    }

    public LocalDate getToDate() {
        return toDate;
    }

    public void setToDate(LocalDate toDate) {
        this.toDate = toDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}

