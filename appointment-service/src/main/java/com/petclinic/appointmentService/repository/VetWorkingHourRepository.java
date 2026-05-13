package com.petclinic.appointmentService.repository;

import com.petclinic.appointmentService.entity.VetWorkingHour;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VetWorkingHourRepository extends JpaRepository<VetWorkingHour, Long> {

    List<VetWorkingHour> findByVetId(Long vetId);
}
