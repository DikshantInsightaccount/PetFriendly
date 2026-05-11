package com.springboot.VetService.Exceptions;

public class InvalidDateRangeException extends VetServiceException {
    public InvalidDateRangeException(String message) {
        super(message);
    }
}
