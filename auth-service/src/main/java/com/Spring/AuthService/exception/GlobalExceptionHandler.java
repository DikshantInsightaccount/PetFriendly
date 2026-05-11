package com.Spring.AuthService.exception;



import com.Spring.AuthService.exception.*;
import com.Spring.AuthService.util.ResponseMessage;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ResponseMessage<Void>> handleAuthenticationException(
            AuthenticationException ex) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ResponseMessage<>(
                        ex.getMessage(),
                        HttpStatus.UNAUTHORIZED.value(),
                        null
                ));
    }

    @ExceptionHandler(TokenException.class)
    public ResponseEntity<ResponseMessage<Void>> handleTokenException(
            TokenException ex) {

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ResponseMessage<>(
                        ex.getMessage(),
                        HttpStatus.UNAUTHORIZED.value(),
                        null
                ));
    }

    @ExceptionHandler(AuthorizationException.class)
    public ResponseEntity<ResponseMessage<Void>> handleAuthorizationException(
            AuthorizationException ex) {

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(new ResponseMessage<>(
                        ex.getMessage(),
                        HttpStatus.FORBIDDEN.value(),
                        null
                ));
    }

    @ExceptionHandler(UserException.class)
    public ResponseEntity<ResponseMessage<Void>> handleUserException(
            UserException ex) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ResponseMessage<>(
                        ex.getMessage(),
                        HttpStatus.BAD_REQUEST.value(),
                        null
                ));
    }

    @ExceptionHandler(RequestException.class)
    public ResponseEntity<ResponseMessage<Void>> handleRequestException(
            RequestException ex) {

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new ResponseMessage<>(
                        ex.getMessage(),
                        HttpStatus.BAD_REQUEST.value(),
                        null
                ));
    }

    // ✅ Fallback for any unexpected error
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ResponseMessage<Void>> handleGenericException(
            Exception ex) {

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(new ResponseMessage<>(
                        "Internal server error",
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        null
                ));
    }
}