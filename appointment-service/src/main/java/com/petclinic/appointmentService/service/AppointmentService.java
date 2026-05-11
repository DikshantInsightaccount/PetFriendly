package com.petclinic.appointmentService.service;

import com.petclinic.appointmentService.dto.*;
import com.petclinic.appointmentService.entity.AppointmentStatus;

import java.util.List;

public interface AppointmentService {

    AppointmentResponse book(Long userId, String role, CreateAppointmentRequest request);

    AppointmentResponse getById(Long appointmentId, Long userId, String role);

    List<AppointmentResponse> myAppointments(Long ownerId);

    List<AppointmentResponse> doctorAppointments(Long vetId, Long userId, String role);

    AppointmentResponse cancel(Long appointmentId, Long userId, String role);

    AppointmentResponse updateStatus(Long appointmentId, AppointmentStatus status, Long userId, String role);

    List<AppointmentResponse> adminAllAppointments();
}
