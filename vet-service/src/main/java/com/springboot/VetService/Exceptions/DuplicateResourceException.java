package com.springboot.VetService.Exceptions;

public class DuplicateResourceException extends VetServiceException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}
