package com.Spring.AuthService.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class RequestExceptionTest {

    @Test
    void testRequestException() {

        RequestException exception =
                new RequestException(
                        "Invalid request"
                );

        assertEquals(
                "Invalid request",
                exception.getMessage()
        );
    }
}