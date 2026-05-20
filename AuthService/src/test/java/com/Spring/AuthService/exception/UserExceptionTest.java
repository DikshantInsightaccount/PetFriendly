package com.Spring.AuthService.exception;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserExceptionTest {

    @Test
    void testUserException() {

        UserException exception =
                new UserException(
                        "User not found"
                );

        assertEquals(
                "User not found",
                exception.getMessage()
        );
    }
}