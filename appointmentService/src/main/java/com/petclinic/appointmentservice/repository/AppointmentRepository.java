package com.petclinic.appointmentservice.repository;

import com.petclinic.appointmentservice.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByVetIdOrderByCreatedAtDesc(Long vetId);
    List<Appointment> findByPetIdOrderByCreatedAtDesc(Long petId);

    @Query(value = """
      SELECT a.* 
      FROM appointments a
      JOIN pets p ON a.pet_id = p.pet_id
      WHERE p.owner_id = :ownerId
      ORDER BY a.created_at DESC
      """, nativeQuery = true)
    List<Appointment> findMyAppointments(@Param("ownerId") Long ownerId);

}
