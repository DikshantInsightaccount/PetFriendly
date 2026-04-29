package com.example.demo.Service;

import com.example.demo.Exceptions.VisitNotexistExceptions;
import com.example.demo.entities.Visit;
import com.example.demo.repositories.VisitRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class VisitService {
    private VisitRepository visitRepository;

    public VisitService(VisitRepository visitRepository) {
        this.visitRepository = visitRepository;
    }
    public List<Visit> getAllvisits(){
        return this.visitRepository.findAll();
    }
    public Visit addvisits(Visit visit){
        return visitRepository.save(visit);
    }
    public Visit getOnevisit(Long id) {
        return visitRepository.findById(id)
                .orElseThrow(() -> new VisitNotexistExceptions("Visit with id " + id + " not found"));
    }

    public Visit patchVisit(Long id, Visit updatedVisit) {

        Visit existingVisit = visitRepository.findById(id)
                .orElseThrow(() ->
                        new VisitNotexistExceptions("Visit with id " + id + " not found"));

        if (updatedVisit.getAppointmentId() != null)
            existingVisit.setAppointmentId(updatedVisit.getAppointmentId());

        if (updatedVisit.getDiagnosis() != null)
            existingVisit.setDiagnosis(updatedVisit.getDiagnosis());

        if (updatedVisit.getTreatment() != null)
            existingVisit.setTreatment(updatedVisit.getTreatment());

        if (updatedVisit.getPrescription() != null)
            existingVisit.setPrescription(updatedVisit.getPrescription());

        if (updatedVisit.getNotes() != null)
            existingVisit.setNotes(updatedVisit.getNotes());

        // updatedAt is handled automatically via @PreUpdate
        return visitRepository.save(existingVisit);
    }
    public List<Visit> getVisitbyappoinment(Long appointmentId) {
        return visitRepository.findByAppointmentId(appointmentId);
    }
    public List<Visit> getVisitbyPet(Long petId) {
        return visitRepository.findByPetId(petId);
    }

}
