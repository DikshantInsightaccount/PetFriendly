package com.example.demo.Exceptions;

public class ResourceException extends RuntimeException {
    public ResourceException(String message) {
        super(message);
    }

    public ResourceException() {
    }
}