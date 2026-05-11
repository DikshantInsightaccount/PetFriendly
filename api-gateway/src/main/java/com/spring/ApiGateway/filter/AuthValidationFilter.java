package com.spring.ApiGateway.filter;
//package com.spring.Api.ApiGateway.client.AuthServiceClient;
import com.spring.ApiGateway.client.AuthServiceClient;
import com.spring.ApiGateway.exception.AuthServiceException;
import com.spring.ApiGateway.exception.AuthenticationException;
import com.spring.ApiGateway.util.GatewayUtils;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpMethod;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class AuthValidationFilter implements GlobalFilter, Ordered {

    private final AuthServiceClient authServiceClient;

    public AuthValidationFilter(AuthServiceClient authServiceClient) {
        this.authServiceClient = authServiceClient;
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange,
                             org.springframework.cloud.gateway.filter.GatewayFilterChain chain) {

        String path = exchange.getRequest().getURI().getPath();
        HttpMethod method = exchange.getRequest().getMethod();

        // ✅ Allow CORS preflight
        if (method == HttpMethod.OPTIONS) {
            return chain.filter(exchange);
        }

        // ✅ Public routes
        if (GatewayUtils.isAuthEndpoint(path) ||
                GatewayUtils.isPublicInfraEndpoint(path)) {
            return chain.filter(exchange);
        }

        // ✅ Token required
        String token = GatewayUtils.extractToken(exchange);

        if (token == null || token.isBlank()) {
            return Mono.error(
                    new AuthenticationException("Authorization token is required")
            );
        }

        if (!token.startsWith("Bearer ")) {
            return Mono.error(
                    new AuthenticationException("Invalid token format")
            );
        }

        return authServiceClient.validateToken(token)
                .flatMap(claims -> {
                    String userId = String.valueOf(claims.get("userId"));
                    String role = String.valueOf(claims.get("role"));

                    // ✅ FIX‑2: ADMIN‑only enforcement at Gateway
                    if (path.startsWith("/admin/") && !"ADMIN".equals(role)) {
                        return Mono.error(
                                new AuthenticationException("Forbidden: ADMIN role required")
                        );
                    }

                    ServerHttpRequest mutatedRequest =
                            exchange.getRequest().mutate()
                                    .header("X-User-Id", userId)
                                    .header("X-Role", role)
                                    .build();

                    return chain.filter(
                            exchange.mutate().request(mutatedRequest).build()
                    );
                })
                // ✅ Preserve correct status codes
                .onErrorMap(ex -> {
                    if (ex instanceof AuthenticationException) {
                        return ex; // 401 / 403
                    }
                    if (ex instanceof AuthServiceException) {
                        return ex;
                    }
                    return new AuthServiceException(
                            "Authentication service unavailable"
                    );
                });
    }

    @Override
    public int getOrder() {
        return -1;
    }
}

