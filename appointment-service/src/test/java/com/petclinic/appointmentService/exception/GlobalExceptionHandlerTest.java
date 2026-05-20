package com.petclinic.appointmentService.exception;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingRequestHeaderException;
import jakarta.servlet.http.HttpServletRequest;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GlobalExceptionHandlerTest {

    private final GlobalExceptionHandler handler = new GlobalExceptionHandler();



    private HttpServletRequest mockRequest() {
        HttpServletRequest req = mock(HttpServletRequest.class);
        when(req.getRequestURI()).thenReturn("/test");
        return req;
    }


    @Test
    void shouldHandleNotFound() {
        var ex = new NotFoundException("not found");

        ResponseEntity<ApiError> res = handler.nf(ex, mockRequest());

        assertEquals(404, res.getStatusCode().value());
        assertEquals("not found", res.getBody().getMessage());
    }


    @Test
    void shouldHandleConflict() {
        var ex = new ConflictException("conflict");

        ResponseEntity<ApiError> res = handler.cf(ex, mockRequest());

        assertEquals(409, res.getStatusCode().value());
        assertEquals("conflict", res.getBody().getMessage());
    }

    @Test
    void shouldHandleDataIntegrityViolation_whenRootCauseIsNull() {

        DataIntegrityViolationException ex =
                new DataIntegrityViolationException("db error");

        ResponseEntity<ApiError> res =
                handler.div(ex, mockRequest());

        assertEquals(400, res.getStatusCode().value());
        assertTrue(res.getBody().getMessage().contains("db error"));
    }

    @Test
    void shouldHandleBadRequest() {
        var ex = new BadRequestException("bad request");

        ResponseEntity<ApiError> res = handler.br(ex, mockRequest());

        assertEquals(400, res.getStatusCode().value());
        assertEquals("bad request", res.getBody().getMessage());
    }


    @Test
    void shouldHandleForbidden() {
        var ex = new ForbiddenException("forbidden");

        ResponseEntity<ApiError> res = handler.fb(ex, mockRequest());

        assertEquals(403, res.getStatusCode().value());
        assertEquals("forbidden", res.getBody().getMessage());
    }

    @Test
    void shouldHandleValidation() {
        var ex = mock(MethodArgumentNotValidException.class);
        when(ex.getMessage()).thenReturn("validation error");

        ResponseEntity<ApiError> res = handler.handleValidation(ex, mockRequest());

        assertEquals(400, res.getStatusCode().value());
        assertEquals("validation error", res.getBody().getMessage());
    }

    @Test
    void shouldHandleMissingHeader() {
        var ex = mock(MissingRequestHeaderException.class);
        when(ex.getMessage()).thenReturn("missing header");

        ResponseEntity<ApiError> res = handler.handleMissingHeader(ex, mockRequest());

        assertEquals(400, res.getStatusCode().value());
    }


    @Test
    void shouldHandleDataIntegrityViolation_withRootMessage() {

        Throwable root = new RuntimeException("FK constraint failed");

        DataIntegrityViolationException ex =
                new DataIntegrityViolationException("db error", root);

        ResponseEntity<ApiError> res = handler.div(ex, mockRequest());

        assertEquals(400, res.getStatusCode().value());
        assertTrue(res.getBody().getMessage().contains("FK constraint failed"));
    }

    @Test
    void shouldHandleDataIntegrityViolation_withNullMessage() {

        Throwable root = new RuntimeException((String) null);

        DataIntegrityViolationException ex =
                new DataIntegrityViolationException("db error", root);

        ResponseEntity<ApiError> res = handler.div(ex, mockRequest());

        assertEquals(400, res.getStatusCode().value());
        assertTrue(res.getBody().getMessage().contains("Unknown DB constraint error"));
    }


    @Test
    void shouldHandleGenericException() {

        Exception ex = new RuntimeException("unexpected");

        ResponseEntity<ApiError> res = handler.ge(ex, mockRequest());

        assertEquals(500, res.getStatusCode().value());
        assertEquals("unexpected", res.getBody().getMessage());
    }
}