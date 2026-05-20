package com.springboot.VetService.Repository;

import com.springboot.VetService.Entity.Vet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface VetDetailsRepository extends JpaRepository<Vet, Long> {

    @Query(value = "SELECT vet_id FROM vet_details WHERE user_id = :userId", nativeQuery = true)
    Optional<Long> findVetIdByUserId(@Param("userId") Long userId);
}