package com.example.demo.repositories;

import com.example.demo.entities.Petentity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface PetRepository extends JpaRepository<Petentity, Long> {
    List<Petentity> findByIsDeletedFalse();
    Optional<Petentity> findByIdAndIsDeletedFalse(Long id);
    List<Petentity> findByOwnerIdAndIsDeletedFalse(Long ownerId);
}
