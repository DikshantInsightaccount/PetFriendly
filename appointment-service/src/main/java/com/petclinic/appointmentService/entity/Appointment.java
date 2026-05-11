package com.petclinic.appointmentService.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "appointments")
@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class Appointment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "appointment_id")
    private Long appointmentId;

    // External references (do NOT map as entities)
    @Column(name = "pet_id", nullable = false)
    private Long petId;

    @Column(name = "vet_id", nullable = false)
    private Long vetId;

    @Column(name = "appointment_type_id", nullable = false)
    private Long appointmentTypeId;

    // Internal relation (owned table)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "slot_id", nullable = false)
    private DoctorSlot slot;

    @Enumerated(EnumType.STRING)
    @Column(name = "appointment_mode", nullable = false)
    private AppointmentMode appointmentMode;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppointmentStatus status;

    @Column(name = "owner_id",nullable = false)
    private Long ownerId;

    @Column(name = "actual_start_time")
    private LocalDateTime actualStartTime;

    @Column(name = "actual_end_time")
    private LocalDateTime actualEndTime;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
