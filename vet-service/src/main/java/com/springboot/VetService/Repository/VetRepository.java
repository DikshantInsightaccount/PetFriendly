package com.springboot.VetService.Repository;

import com.springboot.VetService.Entity.Vet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VetRepository extends JpaRepository<Vet, Long> {

    Optional<Vet> findByUserId(Long userId);
}