package com.petclinic.appointmentService.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.apache.coyote.BadRequestException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ApiError> nf(NotFoundException ex, HttpServletRequest req) {
        return build(HttpStatus.NOT_FOUND, ex, req);
    }

    @ExceptionHandler(ConflictException.class)
    public ResponseEntity<ApiError> cf(ConflictException ex, HttpServletRequest req) {
        return build(HttpStatus.CONFLICT, ex, req);
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiError> br(BadRequestException ex, HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST, ex, req);
    }

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiError> fb(ForbiddenException ex, HttpServletRequest req) {
        return build(HttpStatus.FORBIDDEN, ex, req);
    }

    // DB FK violations (pet_id/vet_id/type_id wrong) will land here -> 400
    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> div(DataIntegrityViolationException ex, HttpServletRequest req) {
        return build(HttpStatus.BAD_REQUEST, new RuntimeException("Invalid reference ID (pet/vet/type). Check IDs."), req);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> ge(Exception ex, HttpServletRequest req) {
        return build(HttpStatus.INTERNAL_SERVER_ERROR, ex, req);
    }

    private ResponseEntity<ApiError> build(HttpStatus st, Exception ex, HttpServletRequest req) {
        ApiError err = ApiError.builder()
                .timestamp(LocalDateTime.now())
                .status(st.value())
                .error(st.getReasonPhrase())
                .message(ex.getMessage())
                .path(req.getRequestURI())
                .build();
        return ResponseEntity.status(st).body(err);
    }
}