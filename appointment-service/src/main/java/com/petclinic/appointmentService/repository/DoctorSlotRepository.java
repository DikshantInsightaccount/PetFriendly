package com.petclinic.appointmentService.repository;

import com.petclinic.appointmentService.entity.DoctorSlot;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

public interface DoctorSlotRepository extends JpaRepository<DoctorSlot,Long> {
    List<DoctorSlot> findByVetIdAndSlotDateAndIsAvailableTrueOrderByStartTime(Long vetId, LocalDate slotDate);

    Boolean existsByVetIdAndSlotDateAndStartTimeAndEndTime(Long vetId, LocalDate slotDate, LocalTime start, LocalTime end);

    @Query(value = "SELECT * FROM doctor_slots WHERE slot_id = :slotId FOR UPDATE", nativeQuery = true)
    Optional<DoctorSlot> findByIdForUpdate(@Param("slotId") Long slotId);
}
