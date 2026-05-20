package com.Spring.AuthService.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AuthenticationExceptionTest {

    @Test
    void testAuthenticationException() {

        AuthenticationException exception =
                new AuthenticationException(
                        "Invalid credentials"
                );

        assertEquals(
                "Invalid credentials",
                exception.getMessage()
        );
    }
}