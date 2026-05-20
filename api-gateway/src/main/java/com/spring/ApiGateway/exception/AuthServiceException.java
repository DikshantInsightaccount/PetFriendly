package com.spring.ApiGateway.exception;



public class AuthServiceException extends RuntimeException {

    public AuthServiceException(String message) {
        super(message);
    }
}

