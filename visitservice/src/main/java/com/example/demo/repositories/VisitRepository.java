package com.example.demo.repositories;

import com.example.demo.entities.Visit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VisitRepository extends JpaRepository<Visit, Long> {

    // ✅ appointment_id is UNIQUE → return Optional or single Visit
    Optional<Visit> findByAppointmentId(Long appointmentId);

    List<Visit> findByPetId(Long petId);
}