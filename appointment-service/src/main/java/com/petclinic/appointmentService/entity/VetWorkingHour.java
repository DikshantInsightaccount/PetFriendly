package com.petclinic.appointmentService.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(name = "vet_working_hours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class VetWorkingHour {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "working_hour_id")
    private Long workingHourId;

    @Column(name = "vet_id", nullable = false)
    private Long vetId;

    @Column(name = "day_of_week", nullable = false)
    private String dayOfWeek;   // MON, TUE, WED...

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;
}
