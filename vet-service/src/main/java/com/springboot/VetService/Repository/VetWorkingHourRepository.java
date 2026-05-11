package com.springboot.VetService.Repository;

import com.springboot.VetService.Entity.VetWorkingHour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VetWorkingHourRepository
        extends JpaRepository<VetWorkingHour, Long> {

    List<VetWorkingHour> findByVet_VetId(Long vetId);

    boolean existsByVet_VetIdAndDayOfWeek(Long vetId, String dayOfWeek);
}
