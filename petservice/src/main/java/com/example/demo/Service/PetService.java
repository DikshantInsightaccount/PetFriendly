package com.example.demo.Service;

import com.example.demo.entities.Petentity;
import com.example.demo.repositories.PetRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class PetService {

    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }


    @Transactional(readOnly = true)
    public List<Petentity> getAllpets() {
        return petRepository.findByIsDeletedFalse();
    }

    @Transactional(readOnly = true)
    public List<Petentity> getPetsByOwner(Long ownerId) {
        return petRepository.findByOwnerIdAndIsDeletedFalse(ownerId);
    }


    @Transactional(readOnly = true)
    public Petentity getPetSecure(Long petId, Long userId, String role) {
        Petentity pet = petRepository.findByIdAndIsDeletedFalse(petId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found"));

        if (!isAdmin(role) && !pet.getOwnerId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Access denied");
        }

        return pet;
    }


    public Petentity addpets(Petentity pet) {

        if (pet.getId() != null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Do not send id in create request");
        }

        if (pet.getName() == null || pet.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
        }

        if (pet.getOwnerId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ownerId missing from context");
        }

        return petRepository.save(pet);
    }

    public Petentity updatePetSecure(Long petId, Long userId, String role, Petentity updated) {

        Petentity existing = getPetSecure(petId, userId, role);

        if (updated.getName() == null || updated.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
        }

        existing.setName(updated.getName());
        existing.setDateOfBirth(updated.getDateOfBirth());
        existing.setType(updated.getType());
        existing.setBreed(updated.getBreed());
        existing.setGender(updated.getGender());


        return petRepository.save(existing);
    }

    public Petentity patchPetSecure(Long petId, Long userId, String role, Petentity patch) {

        Petentity existing = getPetSecure(petId, userId, role);

        if (patch.getName() != null && !patch.getName().isBlank()) {
            existing.setName(patch.getName());
        }
        if (patch.getBreed() != null) {
            existing.setBreed(patch.getBreed());
        }
        if (patch.getGender() != null) {
            existing.setGender(patch.getGender());
        }
        if (patch.getDateOfBirth() != null) {
            existing.setDateOfBirth(patch.getDateOfBirth());
        }


        return petRepository.save(existing);
    }


    public String deleteSecure(Long petId, Long userId, String role) {

        Petentity pet = getPetSecure(petId, userId, role);

        pet.setDeleted(true);
        petRepository.save(pet);

        return "Pet soft-deleted successfully";
    }

    private boolean isAdmin(String role) {
        return "ADMIN".equalsIgnoreCase(role);
    }
}
