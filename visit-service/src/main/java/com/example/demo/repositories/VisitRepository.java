package com.example.demo.repositories;

import com.example.demo.entities.Visit;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;


public interface VisitRepository extends JpaRepository<Visit,Long > {
    List<Visit> findByAppointmentId(Long appointmentId);
    List<Visit> findByPetId(Long petId);
}
