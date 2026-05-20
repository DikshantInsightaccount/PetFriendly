package com.example.demo.Controller;

import com.example.demo.Service.VisitService;
import com.example.demo.entities.Visit;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/visits")
public class VisitController {

    private final VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    // Get all visits
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Visit>> getAllVisits() {
        return ResponseEntity.ok(visitService.getAllVisits());
    }

    // Create a visit
    @PostMapping(
            path = { "", "/" },
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<Visit> createVisit(@RequestBody Visit visit) {
        return ResponseEntity.status(201).body(visitService.createVisit(visit));
    }

    // Get visit by visit_id
    @GetMapping(value = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Visit> getVisitById(@PathVariable Long id) {
        return ResponseEntity.ok(visitService.getVisitById(id));
    }

    // PATCH only mutable fields (service enforces this)
    @PatchMapping(value = "/{id}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Visit> updateVisit(
            @PathVariable Long id,
            @RequestBody Visit visit) {

        return ResponseEntity.ok(visitService.patchVisit(id, visit));
    }

    // Get visit by appointment_id (VALID & UNIQUE)
    @GetMapping(value = "/appointment/{appointmentId}",
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Visit> getVisitByAppointment(
            @PathVariable Long appointmentId) {

        return ResponseEntity.ok(
                visitService.getVisitByAppointmentId(appointmentId)
        );
    }

    @GetMapping(path="/pet/{petId}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Visit>> getVisitbyPet(@PathVariable Long petId) {
        return ResponseEntity.ok(visitService.getVisitbyPet(petId));
    }
}