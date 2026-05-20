package com.Spring.AuthService.exception;

import com.Spring.AuthService.util.ResponseMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;

class GlobalExceptionHandlerTest {

    private GlobalExceptionHandler handler;

    @BeforeEach
    void setUp() {

        handler = new GlobalExceptionHandler();
    }

    @Test
    void testHandleAuthenticationException() {

        AuthenticationException exception =
                new AuthenticationException(
                        "Invalid credentials"
                );

        ResponseEntity<ResponseMessage<Void>> response =
                handler.handleAuthenticationException(exception);

        assertEquals(401, response.getBody().getStatus());

        assertEquals(
                "Invalid credentials",
                response.getBody().getMessage()
        );
    }

    @Test
    void testHandleTokenException() {

        TokenException exception =
                new TokenException(
                        "Invalid token"
                );

        ResponseEntity<ResponseMessage<Void>> response =
                handler.handleTokenException(exception);

        assertEquals(401, response.getBody().getStatus());

        assertEquals(
                "Invalid token",
                response.getBody().getMessage()
        );
    }

    @Test
    void testHandleAuthorizationException() {

        AuthorizationException exception =
                new AuthorizationException(
                        "Forbidden"
                );

        ResponseEntity<ResponseMessage<Void>> response =
                handler.handleAuthorizationException(exception);

        assertEquals(403, response.getBody().getStatus());

        assertEquals(
                "Forbidden",
                response.getBody().getMessage()
        );
    }

    @Test
    void testHandleUserException() {

        UserException exception =
                new UserException(
                        "User not found"
                );

        ResponseEntity<ResponseMessage<Void>> response =
                handler.handleUserException(exception);

        assertEquals(400, response.getBody().getStatus());

        assertEquals(
                "User not found",
                response.getBody().getMessage()
        );
    }

    @Test
    void testHandleRequestException() {

        RequestException exception =
                new RequestException(
                        "Bad request"
                );

        ResponseEntity<ResponseMessage<Void>> response =
                handler.handleRequestException(exception);

        assertEquals(400, response.getBody().getStatus());

        assertEquals(
                "Bad request",
                response.getBody().getMessage()
        );
    }

    @Test
    void testHandleGenericException() {

        Exception exception =
                new Exception("Unexpected");

        ResponseEntity<ResponseMessage<Void>> response =
                handler.handleGenericException(exception);

        assertEquals(500, response.getBody().getStatus());

        assertEquals(
                "Internal server error",
                response.getBody().getMessage()
        );
    }
}