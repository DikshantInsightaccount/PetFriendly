package com.spring.ApiGateway.exception;

import com.spring.ApiGateway.util.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ResponseMessage<Void>> handleAuthentication(
            AuthenticationException ex) {

        return build(HttpStatus.UNAUTHORIZED, ex.getMessage());
    }

    @ExceptionHandler(AuthorizationException.class)
    public ResponseEntity<ResponseMessage<Void>> handleAuthorization(
            AuthorizationException ex) {

        return build(HttpStatus.FORBIDDEN, ex.getMessage());
    }

    @ExceptionHandler(AuthServiceException.class)
    public ResponseEntity<ResponseMessage<Void>> handleAuthService(
            AuthServiceException ex) {

        return build(HttpStatus.SERVICE_UNAVAILABLE, ex.getMessage());
    }

    @ExceptionHandler(RoutingException.class)
    public ResponseEntity<ResponseMessage<Void>> handleRouting(
            RoutingException ex) {

        return build(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ResponseMessage<Void>> handleBadRequest(
            BadRequestException ex) {

        return build(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    private ResponseEntity<ResponseMessage<Void>> build(
            HttpStatus status, String message) {

        return ResponseEntity.status(status)
                .body(new ResponseMessage<>(
                        message,
                        status.value(),
                        null
                ));
    }
}