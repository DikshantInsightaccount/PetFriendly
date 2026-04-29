package com.example.demo.Exceptions;

import com.example.demo.Exceptions.ResourceException;
import com.example.demo.Exceptions.VisitFoundException;
import com.example.demo.Exceptions.VisitNotexistExceptions;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class MyExceptionHandler {

    @ExceptionHandler(VisitNotexistExceptions.class)
    public ResponseEntity<String> handleVisitNotExist(VisitNotexistExceptions ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(VisitFoundException.class)
    public ResponseEntity<String> handleVisitFound(VisitFoundException ex) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(ex.getMessage());
    }

    @ExceptionHandler(ResourceException.class)
    public ResponseEntity<String> handleResource(ResourceException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }

    // fallback for any other RuntimeException
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntime(RuntimeException ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(ex.getMessage());
    }
}