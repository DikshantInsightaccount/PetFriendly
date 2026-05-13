package com.petclinic.appointmentService.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "vet_breaks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetBreak {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "break_id")
    private Long breakId;

    @Column(name = "vet_id", nullable = false)
    private Long vetId;

    @Column(name = "break_name")
    private String breakName;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
}