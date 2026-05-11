package com.springboot.VetService.Exceptions;

public class InvalidTimeRangeException extends VetServiceException {
    public InvalidTimeRangeException(String message) {
        super(message);
    }
}
