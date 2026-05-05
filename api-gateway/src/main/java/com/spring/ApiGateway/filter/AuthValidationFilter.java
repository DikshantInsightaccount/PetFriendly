package com.spring.ApiGateway.filter;

import com.spring.ApiGateway.client.AuthServiceClient;
import com.spring.ApiGateway.exception.AuthServiceException;
import com.spring.ApiGateway.exception.AuthenticationException;
import com.spring.ApiGateway.util.GatewayUtils;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
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

        if (GatewayUtils.isAuthEndpoint(path)) {
            return chain.filter(exchange);
        }

        String token = GatewayUtils.extractToken(exchange);

        if (token == null) {
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

                    String userId = claims.get("userId").toString();
                    String role = claims.get("role").toString();

                    ServerHttpRequest mutatedRequest =
                            exchange.getRequest().mutate()
                                    .header("X-User-Id", userId)
                                    .header("X-Role", role)
                                    .build();

                    return chain.filter(
                            exchange.mutate().request(mutatedRequest).build()
                    );
                })
                // Preserve existing gateway exceptions
                .onErrorResume(AuthenticationException.class, Mono::error)
                // Wrap only auth-service failures
                .onErrorMap(ex ->
                        new AuthServiceException("Authentication service unavailable"));
    }

    @Override
    public int getOrder() {
        return -1;
    }
}