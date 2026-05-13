package com.petclinic.appointmentService.repository;

import com.petclinic.appointmentService.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByVetIdOrderByCreatedAtDesc(Long vetId);
    List<Appointment> findByPetIdOrderByCreatedAtDesc(Long petId);
    List<Appointment> findByPetIdAndOwnerIdOrderByCreatedAtDesc(Long petId, Long ownerId);
    boolean existsBySlot_SlotId(Long slotId);

    @Query(value = """
      SELECT a.* 
      FROM appointments a
      JOIN pets p ON a.pet_id = p.pet_id
      WHERE p.owner_id = :ownerId
      ORDER BY a.created_at DESC
      """, nativeQuery = true)
    List<Appointment> findMyAppointments(@Param("ownerId") Long ownerId);

    @Query(value = """
    SELECT COUNT(*)
    FROM pets p
    WHERE p.pet_id = :petId
      AND p.owner_id = :ownerId
      AND p.is_deleted = 0
""", nativeQuery = true)
    long countActivePetForOwner(
            @Param("petId") Long petId,
            @Param("ownerId") Long ownerId
    );

    @Query(value = """
    SELECT a.*
    FROM appointments a
    JOIN pets p ON a.pet_id = p.pet_id
    WHERE a.pet_id = :petId
      AND p.owner_id = :ownerId
      AND p.is_deleted = 0
    ORDER BY a.created_at DESC
""", nativeQuery = true)
    List<Appointment> findAppointmentsForOwnerPet(
            @Param("petId") Long petId,
            @Param("ownerId") Long ownerId
    );


}
