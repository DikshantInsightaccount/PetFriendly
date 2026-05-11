package com.springboot.VetService.Exceptions;


import com.springboot.VetService.Util.ResponseMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalVetServiceExceptionHandler {

    @ExceptionHandler(VetServiceException.class)
    public ResponseEntity<ResponseMessage<Void>> handle(VetServiceException e) {
        return ResponseEntity
                .status(400)
                .body(new ResponseMessage<>(e.getMessage(), 400, null));
    }
}
