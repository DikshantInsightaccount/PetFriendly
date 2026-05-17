package com.Spring.AuthService.security;

import org.junit.jupiter.api.Test;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class SecurityConfigTest {

    @Test
    void testFilterChainCreation() throws Exception {

        SecurityConfig securityConfig =
                new SecurityConfig();

        HttpSecurity httpSecurity =
                mock(HttpSecurity.class,
                        RETURNS_DEEP_STUBS);

        assertDoesNotThrow(() -> {

            SecurityFilterChain filterChain =
                    securityConfig.filterChain(httpSecurity);

            assertNotNull(filterChain);
        });
    }
}