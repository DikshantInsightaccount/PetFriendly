package com.Spring.AuthService.security;



import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // Disable CSRF for REST APIs
                .csrf(csrf -> csrf.disable())

                // Configure endpoint access
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/users/**").permitAll() // TRUST GATEWAY
                        .requestMatchers("/admin/**").permitAll()
                        .anyRequest().authenticated()
                )

                // Disable default login form
                .formLogin(form -> form.disable())

                // Disable HTTP Basic auth popup
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}