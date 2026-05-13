package com.springboot.VetService.Controller;

import com.springboot.VetService.DTO.VetSummaryDto;
import com.springboot.VetService.Entity.*;
import com.springboot.VetService.Service.VetService;
import com.springboot.VetService.DTO.CreateVetRequest;

import com.springboot.VetService.Util.ResponseMessage;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vets")
public class VetController {

    private final VetService vetService;

    public VetController(VetService vetService) {
        this.vetService = vetService;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseMessage<Vet>> createVetWithTypes(
            @RequestBody CreateVetRequest request
    ) {
        Vet vet = vetService.createVetWithAppointmentTypes(
                request.getUserId(),
                request.getAppointmentTypeIds()
        );

        return ResponseEntity.ok(
                new ResponseMessage<>("Vet created with appointment types", 200, vet)
        );
    }
//    // POST /vets---------
//    @PostMapping(produces = MediaType.APPLICATION_JSON_VALUE)
//    public ResponseEntity<ResponseMessage<Vet>> createVet(@RequestParam Long userId) {
//        Vet vet = vetService.createVet(userId);
//        return ResponseEntity.ok(
//                new ResponseMessage<>("Vet created successfully", 200, vet)
//        );
//    }

    // GET /vets/{vetId}-----------
    @GetMapping(path = "/{vetId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseMessage<Vet>> getVetById(@PathVariable Long vetId) {
        Vet vet = vetService.getVetById(vetId);
        return ResponseEntity.ok(
                new ResponseMessage<>("Vet fetched successfully", 200, vet)
        );
    }

    // GET /vets?speciality=CONSULTATION---------
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseMessage<List<Vet>>> getVetsBySpeciality(
            @RequestParam String speciality) {

        List<Vet> vets = vetService.getVetsBySpeciality(speciality);
        return ResponseEntity.ok(
                new ResponseMessage<>("Vets fetched successfully", 200, vets)
        );
    }

    // POST /vets/{vetId}/working-hours---------
    @PostMapping(
            path = "/{vetId}/working-hours",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResponseMessage<VetWorkingHour>> addWorkingHour(
            @PathVariable Long vetId,
            @RequestBody VetWorkingHour workingHour) {

        VetWorkingHour saved = vetService.addWorkingHour(vetId, workingHour);
        return ResponseEntity.ok(
                new ResponseMessage<>("Working hours added successfully", 200, saved)
        );
    }

    // GET /vets/{vetId}/working-hours---------
    @GetMapping(path = "/{vetId}/working-hours", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseMessage<List<VetWorkingHour>>> getWorkingHours(
            @PathVariable Long vetId) {

        List<VetWorkingHour> hours = vetService.getWorkingHours(vetId);
        return ResponseEntity.ok(
                new ResponseMessage<>("Working hours fetched successfully", 200, hours)
        );
    }

    // POST /vets/{vetId}/breaks--------
    @PostMapping(
            path = "/{vetId}/breaks",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResponseMessage<VetBreak>> addBreak(
            @PathVariable Long vetId,
            @RequestBody VetBreak vetBreak) {

        VetBreak saved = vetService.addBreak(vetId, vetBreak);
        return ResponseEntity.ok(
                new ResponseMessage<>("Break added successfully", 200, saved)
        );
    }

    // GET /vets/{vetId}/breaks----------
    @GetMapping(path = "/{vetId}/breaks", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseMessage<List<VetBreak>>> getBreaks(
            @PathVariable Long vetId) {

        List<VetBreak> breaks = vetService.getBreaks(vetId);
        return ResponseEntity.ok(
                new ResponseMessage<>("Breaks fetched successfully", 200, breaks)
        );
    }

    // POST /vets/{vetId}/leave xxxxxxxxxx
    @PostMapping(
            path = "/{vetId}/leave",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResponseMessage<VetLeave>> applyLeave(
            @PathVariable Long vetId,
            @RequestBody VetLeave leave) {

        VetLeave saved = vetService.applyLeave(vetId, leave);
        return ResponseEntity.ok(
                new ResponseMessage<>("Leave applied successfully", 200, saved)
        );
    }

    //get the leaves of a vet
    @GetMapping(
            path = "/{vetId}/holidays",
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResponseMessage<List<VetLeave>>> getVetHolidays(
            @PathVariable Long vetId
    ) {
        List<VetLeave> holidays = vetService.getHolidaysForVet(vetId);
        return ResponseEntity.ok(
                new ResponseMessage<>("Vet holidays fetched successfully", 200, holidays)
        );
    }

    // POST /vets/appointment-types-----------
    @PostMapping(
            path = "/appointment-types",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResponseMessage<AppointmentType>> createAppointmentType(
            @RequestBody AppointmentType appointmentType) {

        AppointmentType saved = vetService.createAppointmentType(appointmentType);
        return ResponseEntity.ok(
                new ResponseMessage<>("Appointment type created successfully", 200, saved)
        );
    }

    // GET /vets/appointment-types----------
    @GetMapping(path = "/appointment-types", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseMessage<List<AppointmentType>>> getAllAppointmentTypes() {

        List<AppointmentType> types = vetService.getAllAppointmentTypes();
        return ResponseEntity.ok(
                new ResponseMessage<>("Appointment types fetched successfully", 200, types)
        );
    }

    // POST /vets/{vetId}/appointment-types-----------
    @PostMapping(
            path = "/{vetId}/appointment-types",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public ResponseEntity<ResponseMessage<Void>> assignAppointmentTypesToVet(
            @PathVariable Long vetId,
            @RequestBody List<Long> appointmentTypeIds) {

        vetService.assignAppointmentTypes(vetId, appointmentTypeIds);
        return ResponseEntity.ok(
                new ResponseMessage<>("Appointment types assigned successfully", 200, null)
        );
    }

    // GET /vets/{vetId}/appointment-types---------
    @GetMapping(path = "/{vetId}/appointment-types", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseMessage<List<AppointmentType>>> getAppointmentTypesForVet(
            @PathVariable Long vetId) {

        List<AppointmentType> types = vetService.getAppointmentTypesForVet(vetId);
        return ResponseEntity.ok(
                new ResponseMessage<>("Vet appointment types fetched successfully", 200, types)
        );
    }


    @GetMapping(path = "/search", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseMessage<List<VetSummaryDto>>> searchVetsBySpeciality(
            @RequestParam String speciality
    ) {
        List<VetSummaryDto> vets = vetService.getVetSummariesBySpeciality(speciality);
        return ResponseEntity.ok(
                new ResponseMessage<>("Vets fetched successfully", 200, vets)
        );
    }

    @GetMapping(path = "/summaries", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<ResponseMessage<List<VetSummaryDto>>> getAllVetSummaries() {
        List<VetSummaryDto> list = vetService.getAllVetSummaries();
        return ResponseEntity.ok(new ResponseMessage<>("Vets fetched successfully", 200, list));
    }


}