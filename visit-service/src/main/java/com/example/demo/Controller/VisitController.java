package com.example.demo.Controller;


import com.example.demo.Service.VisitService;
import com.example.demo.entities.Visit;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/visits")
public class VisitController {
    private VisitService visitService;

    public VisitController(VisitService visitService) {
        this.visitService = visitService;
    }

    @GetMapping(path = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Visit>> findallVisits() {
        return ResponseEntity.ok(visitService.getAllvisits());
    }

    @PostMapping(path = "/", produces = MediaType.APPLICATION_JSON_VALUE, consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Visit> storevisit(@RequestBody Visit visit) {
        return ResponseEntity.ok(visitService.addvisits(visit));
    }

    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Visit> getOnevisit(@PathVariable Long id) {
        return ResponseEntity.ok(visitService.getOnevisit(id));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Visit> patchVisit(
            @PathVariable Long id,
            @RequestBody Visit visit) {

        return ResponseEntity.ok(visitService.patchVisit(id, visit));
    }
    @GetMapping(path="/appointment/{appointmentId}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Visit>> getvisitByappoinment(@PathVariable Long appointmentId) {
        return ResponseEntity.ok(visitService.getVisitbyappoinment(appointmentId));
    }
    @GetMapping(path="/pet/{petId}",produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<List<Visit>> getVisitbyPet(@PathVariable Long petId) {
        return ResponseEntity.ok(visitService.getVisitbyPet(petId));
    }

}
