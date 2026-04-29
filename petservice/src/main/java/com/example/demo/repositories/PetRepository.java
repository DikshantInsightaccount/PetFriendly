package com.example.demo.repositories;

import com.example.demo.entities.Petentity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PetRepository extends JpaRepository<Petentity,Long> {
    List<Petentity> findByOwnerId(Long ownerId);

}
