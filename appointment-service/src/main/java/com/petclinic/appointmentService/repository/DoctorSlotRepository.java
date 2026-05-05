package com.petclinic.appointmentService.repository;

import com.petclinic.appointmentService.entity.DoctorSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface DoctorSlotRepository extends JpaRepository<DoctorSlot, Long> {

    // ✅ Used by frontend / booking
    List<DoctorSlot> findByVetIdAndSlotDateAndIsAvailableTrueOrderByStartTime(
            Long vetId,
            LocalDate slotDate
    );

    // ✅ Prevent duplicate slot generation
    Boolean existsByVetIdAndSlotDateAndStartTimeAndEndTime(
            Long vetId,
            LocalDate slotDate,
            LocalTime start,
            LocalTime end
    );

    // ✅ Used by booking (locking slot)
    @Query(value = "SELECT * FROM doctor_slots WHERE slot_id = :slotId FOR UPDATE", nativeQuery = true)
    Optional<DoctorSlot> findByIdForUpdate(@Param("slotId") Long slotId);

    // ✅ NEW: Used by rolling scheduler
    @Query("""
        SELECT MAX(s.slotDate)
        FROM DoctorSlot s
        WHERE s.vetId = :vetId
    """)
    LocalDate findLastSlotDate(@Param("vetId") Long vetId);
}
