package com.spring.ApiGateway.exception;



public class RoutingException extends RuntimeException {

    public RoutingException(String message) {
        super(message);
    }
}
