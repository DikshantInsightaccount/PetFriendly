package com.springboot.VetService.Exceptions;


public class VetServiceException extends RuntimeException {
    public VetServiceException(String message) {
        super(message);
    }
}
