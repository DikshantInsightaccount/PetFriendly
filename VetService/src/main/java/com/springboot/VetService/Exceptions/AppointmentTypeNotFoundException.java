package com.springboot.VetService.Exceptions;



public class AppointmentTypeNotFoundException extends VetServiceException {

    public AppointmentTypeNotFoundException(Long appointmentTypeId) {
        super("Appointment type not found with id: " + appointmentTypeId);
    }
}

