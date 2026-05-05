package com.spring.ApiGateway.exception;



public class BadRequestException extends RuntimeException {

    public BadRequestException(String message) {
        super(message);
    }
}
