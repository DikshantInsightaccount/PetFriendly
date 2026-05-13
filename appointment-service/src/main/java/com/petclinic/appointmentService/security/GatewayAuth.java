package com.petclinic.appointmentService.security;

import com.petclinic.appointmentService.exception.ForbiddenException;

public final class GatewayAuth {

    public static final String HDR_USER_ID = "X-User-Id";
    public static final String HDR_ROLE    = "X-Role";

    private GatewayAuth() {}
    // ✅ IntelliJ warning fix: make it void (it’s only validation)
    public static void requireUserId(Long userId) {
        if (userId == null) {
            throw new ForbiddenException("Missing X-User-Id header (must be injected by API Gateway)");
        }
    }

    public static void requireRole(String role, String... allowedRoles) {
        if (role == null || role.isBlank()) {
            throw new ForbiddenException("Missing X-Role header (must be injected by API Gateway)");
        }
        for (String a : allowedRoles) {
            if (a.equalsIgnoreCase(role)) return;
        }
        throw new ForbiddenException("Forbidden: required role(s): " + String.join(", ", allowedRoles));
    }
}