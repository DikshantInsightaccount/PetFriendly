package com.petclinic.appointmentService.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "doctor_slots",
        uniqueConstraints = @UniqueConstraint(
                name = "uq_slot_vet_date_time",
                columnNames = {"vet_id", "slot_date", "start_time", "end_time"}
        )
)
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class DoctorSlot {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "slot_id")
    private Long slotId;

    @Column(name = "vet_id", nullable = false)
    private Long vetId; // external reference (Vet Service owns vet)

    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "is_available", nullable = false)
    private boolean isAvailable = true;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
