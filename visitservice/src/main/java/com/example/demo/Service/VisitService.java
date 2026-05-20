package com.example.demo.Service;

import com.example.demo.entities.Visit;
import com.example.demo.repositories.AppointmentRepository;
import com.example.demo.repositories.VisitRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VisitService {

    private final VisitRepository visitRepository;
    private final AppointmentRepository appointmentRepository;

    public VisitService(VisitRepository visitRepository,AppointmentRepository appointmentRepository) {
        this.visitRepository = visitRepository;
        this.appointmentRepository = appointmentRepository;
    }

    public List<Visit> getAllVisits() {
        return visitRepository.findAll();
    }

    // Create a visit (one visit per appointment)
    public Visit createVisit(Visit visit) {

        visitRepository.findByAppointmentId(visit.getAppointmentId())
                .ifPresent(v -> {
                    throw new RuntimeException(
                            "Visit already exists for appointmentId: " + visit.getAppointmentId()
                    );
                });

        Visit saved = visitRepository.save(visit);

        int updated = appointmentRepository.markAppointmentCompleted(visit.getAppointmentId());

        if (updated == 0) {
            throw new RuntimeException("Appointment not found for appointmentId: " + visit.getAppointmentId());
        }

        return saved;

    }

    // Get visit by visit_id
    public Visit getVisitById(Long id) {
        return visitRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Visit not found with id: " + id));
    }

    // PATCH visit (only mutable fields)
    public Visit patchVisit(Long id, Visit visit) {

        Visit existing = getVisitById(id);

        if (visit.getDiagnosis() != null) {
            existing.setDiagnosis(visit.getDiagnosis());
        }
        if (visit.getTreatment() != null) {
            existing.setTreatment(visit.getTreatment());
        }
        if (visit.getPrescription() != null) {
            existing.setPrescription(visit.getPrescription());
        }
        if (visit.getNotes() != null) {
            existing.setNotes(visit.getNotes());
        }


        return visitRepository.save(existing);
    }

    // Get visit by appointment_id (UNIQUE)
    public Visit getVisitByAppointmentId(Long appointmentId) {
        return visitRepository.findByAppointmentId(appointmentId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Visit not found for appointmentId: " + appointmentId));
    }

    public List<Visit> getVisitbyPet(Long petId) {
        return visitRepository.findByPetId(petId);
    }
}