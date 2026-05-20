package com.spring.ApiGateway.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityWebFilterChain securityWebFilterChain(ServerHttpSecurity http) {

        return http
                // Disable CSRF for APIs
                .csrf(ServerHttpSecurity.CsrfSpec::disable)

                // Let Gateway GlobalFilter handle auth
                .authorizeExchange(exchange ->
                        exchange.anyExchange().permitAll()
                )

                .httpBasic(ServerHttpSecurity.HttpBasicSpec::disable)
                .formLogin(ServerHttpSecurity.FormLoginSpec::disable)

                .build();
    }
}
