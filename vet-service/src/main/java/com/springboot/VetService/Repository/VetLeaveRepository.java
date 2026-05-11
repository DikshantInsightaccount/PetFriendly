package com.springboot.VetService.Repository;

import com.springboot.VetService.Entity.VetLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface VetLeaveRepository
        extends JpaRepository<VetLeave, Long> {

    List<VetLeave> findByVet_VetId(Long vetId);

    boolean existsByVet_VetIdAndFromDateAndToDate(Long vetId, LocalDate fromDate, LocalDate toDate);
}
