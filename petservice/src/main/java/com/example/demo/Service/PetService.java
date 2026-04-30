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
        return petRepository.findAll();
    }

    public Petentity addpets(Petentity petentity) {
        if (petentity.getOwnerId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ownerId is required");
        }
        if (petentity.getName() == null || petentity.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required");
        }
        return petRepository.save(petentity);
    }

    @Transactional(readOnly = true)
    public Petentity getOnePet(Long id) {
        return petRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet with id " + id + " not found"));
    }

    @Transactional(readOnly = true)
    public List<Petentity> getPetsByOwner(Long ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    public Petentity updatePet(Long id, Petentity updatedPet) {
        Petentity existingPet = getOnePet(id);

        if (updatedPet.getOwnerId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "ownerId is required for update");
        }
        if (updatedPet.getName() == null || updatedPet.getName().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "name is required for update");
        }

        existingPet.setName(updatedPet.getName());
        existingPet.setDateOfBirth(updatedPet.getDateOfBirth());
        existingPet.setType(updatedPet.getType());
        existingPet.setBreed(updatedPet.getBreed());
        existingPet.setGender(updatedPet.getGender());
        existingPet.setOwnerId(updatedPet.getOwnerId());

        return petRepository.save(existingPet);
    }
    public Petentity patchPet(Long id, Petentity patch) {
        Petentity existingPet = getOnePet(id);

        boolean changed = false;

        if (patch.getName() != null && !patch.getName().isBlank() && !patch.getName().equals(existingPet.getName())) {
            existingPet.setName(patch.getName());
            changed = true;
        }
        if (patch.getDateOfBirth() != null && !patch.getDateOfBirth().equals(existingPet.getDateOfBirth())) {
            existingPet.setDateOfBirth(patch.getDateOfBirth());
            changed = true;
        }
        if (patch.getType() != null && !patch.getType().equals(existingPet.getType())) {
            existingPet.setType(patch.getType());
            changed = true;
        }
        if (patch.getBreed() != null && !patch.getBreed().equals(existingPet.getBreed())) {
            existingPet.setBreed(patch.getBreed());
            changed = true;
        }
        if (patch.getGender() != null && !patch.getGender().equals(existingPet.getGender())) {
            existingPet.setGender(patch.getGender());
            changed = true;
        }
        if (patch.getOwnerId() != null && !patch.getOwnerId().equals(existingPet.getOwnerId())) {
            existingPet.setOwnerId(patch.getOwnerId());
            changed = true;
        }

        if (!changed) {
            return existingPet;
        }

        return petRepository.save(existingPet);
    }

    public String delete(Long id) {
        if (!petRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Pet not found");
        }

        try {
            petRepository.deleteById(id);
            return "Pet deleted successfully";
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "Cannot delete pet because appointments are referencing it");
        }
    }
}