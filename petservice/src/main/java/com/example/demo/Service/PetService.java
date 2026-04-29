package com.example.demo.Service;

import com.example.demo.entities.Petentity;
import com.example.demo.repositories.PetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PetService {
    private PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }
    public List<Petentity> getAllpets(){
        return this.petRepository.findAll();
    }
    public Petentity addpets(Petentity petentity){
        return petRepository.save(petentity);
    }
    public Petentity getOnePet(Long Id){
        Optional<Petentity> empop=petRepository.findById(Id);
        if(empop.isPresent()){
            return empop.get();
        }
        else{
            throw new RuntimeException("pet with id "+Id+"not found");
        }
    }
    public List<Petentity> getPetsByOwner(Long ownerId) {
        return petRepository.findByOwnerId(ownerId);
    }

    public Optional<Petentity> updatePet(Long id, Petentity updatedPet) {
        Petentity existingPet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet with id " + id + " not found"));

        existingPet.setName(updatedPet.getName());
        existingPet.setDateOfBirth(updatedPet.getDateOfBirth());
        existingPet.setType(updatedPet.getType());
        existingPet.setBreed(updatedPet.getBreed());
        existingPet.setGender(updatedPet.getGender());
        existingPet.setOwnerId(updatedPet.getOwnerId());
        existingPet.setUpdated_at(updatedPet.getUpdated_at());

        return Optional.of(petRepository.save(existingPet));
    }
    public Petentity patchPet(Long id, Petentity updatedPet) {
        Petentity existingPet = petRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pet with id " + id + " not found"));

        if (updatedPet.getName() != null) existingPet.setName(updatedPet.getName());
        if (updatedPet.getDateOfBirth() != null) existingPet.setDateOfBirth(updatedPet.getDateOfBirth());
        if (updatedPet.getType() != null) existingPet.setType(updatedPet.getType());
        if (updatedPet.getBreed() != null) existingPet.setBreed(updatedPet.getBreed());
        if (updatedPet.getGender() != null) existingPet.setGender(updatedPet.getGender());
        if (updatedPet.getOwnerId() != null) existingPet.setOwnerId(updatedPet.getOwnerId());

        // Usually you set updated_at on server side, not from request
        existingPet.setUpdated_at(java.time.LocalDateTime.now());

        return petRepository.save(existingPet);
    }
    public String delete(Long id){
        if(!petRepository.existsById(id)){
            throw new RuntimeException("emp exists in database");
        }
        else{
            petRepository.deleteById(id);
            return "emp deleted";
        }
    }


}
