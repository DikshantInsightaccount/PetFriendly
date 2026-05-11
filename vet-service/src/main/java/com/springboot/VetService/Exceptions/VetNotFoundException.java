package com.springboot.VetService.Exceptions;

public class VetNotFoundException extends VetServiceException {

    public VetNotFoundException(Long vetId) {
        super("Vet not found with id: " + vetId);
    }
}
