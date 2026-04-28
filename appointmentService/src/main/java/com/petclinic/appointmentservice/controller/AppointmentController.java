package com.petclinic.appointmentservice.controller;

import com.petclinic.appointmentservice.dto.*;
import com.petclinic.appointmentservice.security.GatewayAuth;
import com.petclinic.appointmentservice.service.AppointmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/appointments")
public class AppointmentController {

    private final AppointmentService appointmentService;

    /**
     * NOTE:
     * This service does NOT validate JWT.
     * API Gateway validates JWT and injects trusted headers:
     *  - X-User-Id
     *  - X-Role
     */

    // POST /appointments  (OWNER)
    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public AppointmentResponse book(
            @RequestHeader(GatewayAuth.HDR_USER_ID) Long userId,
            @RequestHeader(GatewayAuth.HDR_ROLE) String role,
            @Valid @RequestBody CreateAppointmentRequest request
    ) {
        GatewayAuth.requireUserId(userId);
        GatewayAuth.requireRole(role, "OWNER");

        // ✅ IMPORTANT:
        // Bind booking to authenticated user, so client cannot spoof ownerId.
        // If your CreateAppointmentRequest has ownerId, set it here.
        // request.setOwnerId(userId);

        return appointmentService.book(userId, role, request);
    }

    // GET /appointments/{appointmentId}  (OWNER/VET/ADMIN)
    @GetMapping(value = "/{appointmentId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public AppointmentResponse get(
            @RequestHeader(GatewayAuth.HDR_USER_ID) Long userId,
            @RequestHeader(GatewayAuth.HDR_ROLE) String role,
            @PathVariable Long appointmentId
    ) {
        GatewayAuth.requireUserId(userId);
        GatewayAuth.requireRole(role, "OWNER", "VET", "ADMIN");

        return appointmentService.getById(appointmentId, userId, role);
    }

    // GET /appointments/my  (OWNER)
    @GetMapping(value = "/my", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<AppointmentResponse> my(
            @RequestHeader(GatewayAuth.HDR_USER_ID) Long ownerId,
            @RequestHeader(GatewayAuth.HDR_ROLE) String role
    ) {
        GatewayAuth.requireUserId(ownerId);
        GatewayAuth.requireRole(role, "OWNER");

        return appointmentService.myAppointments(ownerId);
    }

    // GET /appointments/doctor/{vetId}  (VET/ADMIN)
    @GetMapping(value = "/doctor/{vetId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<AppointmentResponse> doctor(
            @RequestHeader(GatewayAuth.HDR_USER_ID) Long userId,
            @RequestHeader(GatewayAuth.HDR_ROLE) String role,
            @PathVariable Long vetId
    ) {
        GatewayAuth.requireUserId(userId);
        GatewayAuth.requireRole(role, "VET", "ADMIN");

        return appointmentService.doctorAppointments(vetId, userId, role);
    }

    // POST /appointments/{appointmentId}/cancel  (OWNER/ADMIN)
    @PostMapping(value = "/{appointmentId}/cancel", produces = MediaType.APPLICATION_JSON_VALUE)
    public AppointmentResponse cancel(
            @RequestHeader(GatewayAuth.HDR_USER_ID) Long userId,
            @RequestHeader(GatewayAuth.HDR_ROLE) String role,
            @PathVariable Long appointmentId
    ) {
        GatewayAuth.requireUserId(userId);
        GatewayAuth.requireRole(role, "OWNER", "ADMIN");

        return appointmentService.cancel(appointmentId, userId, role);
    }

    // PATCH /appointments/{appointmentId}/status  (VET/ADMIN)
    @PatchMapping(
            value = "/{appointmentId}/status",
            consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public AppointmentResponse updateStatus(
            @RequestHeader(GatewayAuth.HDR_USER_ID) Long userId,
            @RequestHeader(GatewayAuth.HDR_ROLE) String role,
            @PathVariable Long appointmentId,
            @Valid @RequestBody UpdateAppointmentStatusRequest req
    ) {
        GatewayAuth.requireUserId(userId);
        GatewayAuth.requireRole(role, "VET", "ADMIN");

        return appointmentService.updateStatus(appointmentId, req.getStatus(), userId, role);
    }

    // GET /appointments/admin/appointments  (ADMIN)
    @GetMapping(value = "/admin/appointments", produces = MediaType.APPLICATION_JSON_VALUE)
    public List<AppointmentResponse> adminAll(
            @RequestHeader(GatewayAuth.HDR_ROLE) String role
    ) {
        GatewayAuth.requireRole(role, "ADMIN");
        return appointmentService.adminAllAppointments();
    }
}
