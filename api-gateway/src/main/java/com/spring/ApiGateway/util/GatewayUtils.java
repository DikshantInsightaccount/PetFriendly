package com.spring.ApiGateway.util;



import org.springframework.http.HttpHeaders;
import org.springframework.web.server.ServerWebExchange;

public class GatewayUtils {

    public static boolean isAuthEndpoint(String path) {
        return path.startsWith("/auth/register") ||
                path.startsWith("/auth/login");
    }

    public static String extractToken(ServerWebExchange exchange) {
        return exchange.getRequest()
                .getHeaders()
                .getFirst(HttpHeaders.AUTHORIZATION);
    }
}

