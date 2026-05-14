package com.springboot.VetService.Service;

import com.springboot.VetService.Repository.VetDetailsRepository;
import org.springframework.stereotype.Service;

@Service
public class VetDetailsService {

    private final VetDetailsRepository repo;

    public VetDetailsService(VetDetailsRepository repo) {
        this.repo = repo;
    }

    public Long getVetIdByUserId(Long userId) {
        return repo.findVetIdByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Vet not found for userId: " + userId));
    }
}
