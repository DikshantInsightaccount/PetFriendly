package com.springboot.VetService.Repository;

import com.springboot.VetService.Entity.VetBreak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalTime;
import java.util.List;

@Repository
public interface VetBreakRepository
        extends JpaRepository<VetBreak, Long> {

    List<VetBreak> findByVet_VetId(Long vetId);

    boolean existsByVet_VetIdAndStartTimeAndEndTime(Long vetId, LocalTime startTime, LocalTime endTime);
}
