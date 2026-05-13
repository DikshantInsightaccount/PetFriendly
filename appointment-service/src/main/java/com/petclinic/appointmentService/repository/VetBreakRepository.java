package com.petclinic.appointmentService.repository;

import com.petclinic.appointmentService.entity.VetBreak;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VetBreakRepository extends JpaRepository<VetBreak, Long> {

    List<VetBreak> findByVetId(Long vetId);
}