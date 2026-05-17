package com.example.demo.repositories;

import com.example.demo.DTO.AppointmentWithPetView;
import com.example.demo.entities.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByVetId(Long vetId);
    List<Appointment> findByVetIdAndPetId(Long vetId, Long petId);

    @Query(value = """
        SELECT
            a.appointment_id AS appointmentId,
            a.pet_id        AS petId,
            p.name          AS petName,
            p.type          AS petType,
            p.breed         AS petBreed,
            a.vet_id        AS vetId,
            a.status        AS status
        FROM appointments a
        JOIN pets p ON p.pet_id = a.pet_id
        WHERE a.vet_id = :vetId
        ORDER BY a.appointment_id DESC
        """, nativeQuery = true)
    List<AppointmentWithPetView> findByVetIdWithPet(@Param("vetId") Long vetId);

    @Query(value = """
        SELECT
            a.appointment_id AS appointmentId,
            a.pet_id        AS petId,
            p.name          AS petName,
            p.type          AS petType,
            p.breed         AS petBreed,
            a.vet_id        AS vetId,
            a.status        AS status
        FROM appointments a
        JOIN pets p ON p.pet_id = a.pet_id
        WHERE a.vet_id = :vetId AND a.pet_id = :petId
        ORDER BY a.appointment_id DESC
        """, nativeQuery = true)
    List<AppointmentWithPetView> findByVetIdAndPetIdWithPet(@Param("vetId") Long vetId,
                                                            @Param("petId") Long petId);

    @Modifying
    @Transactional
    @Query(value = """
    UPDATE appointments
    SET status = 'COMPLETED',
        actual_start_time = COALESCE(actual_start_time, NOW()),
        actual_end_time = NOW(),
        updated_at = NOW()
    WHERE appointment_id = :appointmentId
""", nativeQuery = true)
    int markAppointmentCompleted(@Param("appointmentId") Long appointmentId);
}
