package com.example.demo.Controller;

import com.example.demo.Service.PetService;
import com.example.demo.entities.Petentity;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pets")
@CrossOrigin(origins = "*")
public class Controller {

    private final PetService petService;

    public Controller(PetService petService) {
        this.petService = petService;
    }
    @GetMapping("/my")
    public ResponseEntity<List<Petentity>> myPets(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-Role") String role
    ) {
        requireRole(role, "OWNER", "ADMIN");
        return ResponseEntity.ok(petService.getPetsByOwner(userId));
    }


    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Petentity> addPet(
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-Role") String role,
            @RequestBody Petentity pet
    ) {
        requireRole(role, "OWNER");
        pet.setOwnerId(userId); //
        return ResponseEntity.ok(petService.addpets(pet));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Petentity> updatePet(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-Role") String role,
            @RequestBody Petentity updatedPet
    ) {
        requireRole(role, "OWNER", "ADMIN");
        return ResponseEntity.ok(
                petService.updatePetSecure(id, userId, role, updatedPet)
        );
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Petentity> patchPet(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-Role") String role,
            @RequestBody Petentity patch
    ) {
        requireRole(role, "OWNER", "ADMIN");
        return ResponseEntity.ok(
                petService.patchPetSecure(id, userId, role, patch)
        );
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePet(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-Role") String role
    ) {
        requireRole(role, "OWNER", "ADMIN");
        return ResponseEntity.ok(
                petService.deleteSecure(id, userId, role)
        );
    }

    @GetMapping
    public ResponseEntity<List<Petentity>> allPets(
            @RequestHeader("X-Role") String role
    ) {
        requireRole(role, "ADMIN");
        return ResponseEntity.ok(petService.getAllpets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Petentity> getPet(
            @PathVariable Long id,
            @RequestHeader("X-User-Id") Long userId,
            @RequestHeader("X-Role") String role
    ) {
        return ResponseEntity.ok(
                petService.getPetSecure(id, userId, role)
        );
    }

    private void requireRole(String actualRole, String... allowed) {
        for (String r : allowed) {
            if (r.equalsIgnoreCase(actualRole)) return;
        }
        throw new RuntimeException("Forbidden");
    }
}