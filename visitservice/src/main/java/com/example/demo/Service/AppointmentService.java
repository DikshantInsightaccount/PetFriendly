package com.example.demo.Service;

import com.example.demo.DTO.AppointmentMiniDto;
import com.example.demo.DTO.AppointmentWithPetDto;
import com.example.demo.DTO.AppointmentWithPetView;
import com.example.demo.repositories.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {
    private final AppointmentRepository repo;

    public AppointmentService(AppointmentRepository repo) {
        this.repo = repo;
    }

    // ✅ existing endpoints (keep)
    public List<AppointmentMiniDto> getByVet(Long vetId) {
        return repo.findByVetId(vetId).stream()
                .map(a -> new AppointmentMiniDto(
                        a.getAppointmentId(),
                        a.getPetId(),
                        a.getVetId(),
                        a.getStatus()
                ))
                .toList();
    }

    public List<AppointmentMiniDto> getByVetAndPet(Long vetId, Long petId) {
        return repo.findByVetIdAndPetId(vetId, petId).stream()
                .map(a -> new AppointmentMiniDto(
                        a.getAppointmentId(),
                        a.getPetId(),
                        a.getVetId(),
                        a.getStatus()
                ))
                .toList();
    }

    // ✅ NEW: includes petName/type/breed
    public List<AppointmentWithPetDto> getByVetWithPet(Long vetId) {
        List<AppointmentWithPetView> rows = repo.findByVetIdWithPet(vetId);
        return rows.stream()
                .map(r -> new AppointmentWithPetDto(
                        r.getAppointmentId(),
                        r.getPetId(),
                        r.getPetName(),
                        r.getPetType(),
                        r.getPetBreed(),
                        r.getVetId(),
                        r.getStatus()
                ))
                .toList();
    }

    // ✅ OPTIONAL: includes petName/type/breed for vet+pet
    public List<AppointmentWithPetDto> getByVetAndPetWithPet(Long vetId, Long petId) {
        List<AppointmentWithPetView> rows = repo.findByVetIdAndPetIdWithPet(vetId, petId);
        return rows.stream()
                .map(r -> new AppointmentWithPetDto(
                        r.getAppointmentId(),
                        r.getPetId(),
                        r.getPetName(),
                        r.getPetType(),
                        r.getPetBreed(),
                        r.getVetId(),
                        r.getStatus()
                ))
                .toList();
    }
}