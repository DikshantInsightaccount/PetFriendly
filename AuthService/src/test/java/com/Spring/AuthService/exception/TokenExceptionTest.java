package com.Spring.AuthService.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class TokenExceptionTest {

    @Test
    void testTokenException() {

        TokenException exception =
                new TokenException(
                        "Invalid token"
                );

        assertEquals(
                "Invalid token",
                exception.getMessage()
        );
    }
}