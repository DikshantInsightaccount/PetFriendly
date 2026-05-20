package com.spring.ApiGateway.exception;



public class AuthorizationException extends RuntimeException {

    public AuthorizationException(String message) {
        super(message);
    }
}