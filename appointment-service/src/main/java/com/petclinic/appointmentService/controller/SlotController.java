package com.petclinic.appointmentService.controller;

import com.petclinic.appointmentService.dto.*;
import com.petclinic.appointmentService.security.GatewayAuth;
import com.petclinic.appointmentService.service.SlotService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/slots")
public class SlotController {

    private final SlotService slotService;

    // POST /slots/generate  (VET/ADMIN)
    @PostMapping(value = "/generate", consumes = MediaType.APPLICATION_JSON_VALUE)
    public void generate(
            @RequestHeader(GatewayAuth.HDR_USER_ID) Long userId,
            @RequestHeader(GatewayAuth.HDR_ROLE) String role,
            @Valid @RequestBody GenerateSlotsRequest request
    ) {
        GatewayAuth.requireUserId(userId);
        GatewayAuth.requireRole(role, "VET", "ADMIN");

        slotService.generateSlots(request, userId, role);
    }

    // GET /slots?vetId={vetId}&date={d}  (OWNER/VET/ADMIN)
    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<SlotResponse> available(
            @RequestHeader(GatewayAuth.HDR_ROLE) String role,
            @RequestParam Long vetId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        GatewayAuth.requireRole(role, "OWNER", "VET", "ADMIN");
        return slotService.getAvailableSlots(vetId, date);
    }

    // GET /slots/{slotId}  (OWNER/VET/ADMIN)
    @GetMapping(value = "/{slotId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public SlotResponse get(
            @RequestHeader(GatewayAuth.HDR_ROLE) String role,
            @PathVariable Long slotId
    ) {
        GatewayAuth.requireRole(role, "OWNER", "VET", "ADMIN");
        return slotService.getSlot(slotId);
    }
}
