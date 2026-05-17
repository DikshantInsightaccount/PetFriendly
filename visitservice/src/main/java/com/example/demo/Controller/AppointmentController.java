package com.example.demo.Controller;

import com.example.demo.DTO.AppointmentMiniDto;
import com.example.demo.DTO.AppointmentWithPetDto;
import com.example.demo.Service.AppointmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointment")
public class AppointmentController {
    private final AppointmentService service;

    public AppointmentController(AppointmentService service) {
        this.service = service;
    }

    // old (keep)
    @GetMapping("/vet/{vetId}")
    public ResponseEntity<List<AppointmentMiniDto>> byVet(@PathVariable Long vetId) {
        return ResponseEntity.ok(service.getByVet(vetId));
    }

    // NEW: includes petName/type/breed
    @GetMapping("/vet/{vetId}/with-pet")
    public ResponseEntity<List<AppointmentWithPetDto>> byVetWithPet(@PathVariable Long vetId) {
        return ResponseEntity.ok(service.getByVetWithPet(vetId));
    }

    // old (keep)
    @GetMapping("/vet/{vetId}/pet/{petId}")
    public ResponseEntity<List<AppointmentMiniDto>> byVetAndPet(
            @PathVariable Long vetId,
            @PathVariable Long petId
    ) {
        return ResponseEntity.ok(service.getByVetAndPet(vetId, petId));
    }

    // OPTIONAL: with pet info
    @GetMapping("/vet/{vetId}/pet/{petId}/with-pet")
    public ResponseEntity<List<AppointmentWithPetDto>> byVetAndPetWithPet(
            @PathVariable Long vetId,
            @PathVariable Long petId
    ) {
        return ResponseEntity.ok(service.getByVetAndPetWithPet(vetId, petId));
    }
}