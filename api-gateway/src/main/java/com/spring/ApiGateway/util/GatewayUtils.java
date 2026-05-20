package com.spring.ApiGateway.util;

import org.springframework.http.HttpHeaders;
import org.springframework.web.server.ServerWebExchange;

public class GatewayUtils {

    private GatewayUtils() {}

    /**
     * ✅ All auth endpoints are PUBLIC
     * (/auth/login, /auth/register, /auth/validate)
     */
    public static boolean isAuthEndpoint(String path) {
        return path != null && path.startsWith("/auth/");
    }

    /**
     * ✅ Optional infra endpoints (health checks)
     */
    public static boolean isPublicInfraEndpoint(String path) {
        return path != null && (
                path.startsWith("/actuator") ||
                        path.equals("/actuator")
        );
    }

    public static String extractToken(ServerWebExchange exchange) {
        return exchange
                .getRequest()
                .getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);
    }
}