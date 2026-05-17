package com.Spring.AuthService.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AuthorizationExceptionTest {

    @Test
    void testAuthorizationException() {

        AuthorizationException exception =
                new AuthorizationException(
                        "Access denied"
                );

        assertEquals(
                "Access denied",
                exception.getMessage()
        );
    }
}