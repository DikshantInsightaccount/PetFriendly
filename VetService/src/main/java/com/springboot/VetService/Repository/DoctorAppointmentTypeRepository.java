package com.springboot.VetService.Repository;

import com.springboot.VetService.Entity.DoctorAppointmentType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorAppointmentTypeRepository
        extends JpaRepository<DoctorAppointmentType, Long> {

    List<DoctorAppointmentType> findByVet_VetId(Long vetId);

    boolean existsByVet_VetIdAndAppointmentType_AppointmentTypeId(
            Long vetId,
            Long appointmentTypeId
    );
}
