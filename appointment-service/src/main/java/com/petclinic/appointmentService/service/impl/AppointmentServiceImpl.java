package com.petclinic.appointmentService.service.impl;

import com.petclinic.appointmentService.dto.*;
import com.petclinic.appointmentService.entity.*;
import com.petclinic.appointmentService.exception.*;
import com.petclinic.appointmentService.repository.*;
import com.petclinic.appointmentService.service.AppointmentService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepo;
    private final DoctorSlotRepository slotRepo;

    private boolean isAdmin(String role) { return "ADMIN".equalsIgnoreCase(role); }
    private boolean isOwner(String role) { return "OWNER".equalsIgnoreCase(role); }
    private boolean isVet(String role)   { return "VET".equalsIgnoreCase(role); }

    @Override
    @Transactional
    public AppointmentResponse book(Long userId, String role, CreateAppointmentRequest req) {

        if (!isOwner(role)) {
            throw new ForbiddenException("Only OWNER can book appointments");
        }

        DoctorSlot slot = slotRepo.findByIdForUpdate(req.getSlotId())
                .orElseThrow(() -> new NotFoundException("Slot not found: " + req.getSlotId()));

        if (Boolean.FALSE.equals(slot.getIsAvailable())) {
            throw new ConflictException("Slot is not available: " + slot.getSlotId());
        }

        if (!slot.getVetId().equals(req.getVetId())) {
            throw new BadRequestException("Slot does not belong to vetId=" + req.getVetId());
        }

        slot.setIsAvailable(false);
        slotRepo.save(slot);

        Appointment appt = Appointment.builder()
                .petId(req.getPetId())
                .vetId(req.getVetId())
                .appointmentTypeId(req.getAppointmentTypeId())
                .slot(slot)
                .appointmentMode(req.getAppointmentMode())
                .status(AppointmentStatus.BOOKED)
                .build();

        return toResponse(appointmentRepo.save(appt));
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentResponse getById(Long appointmentId, Long userId, String role) {

        Appointment appt = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + appointmentId));

        if (isAdmin(role)) return toResponse(appt);

        if (isVet(role) && appt.getVetId() != null) {
            return toResponse(appt);
        }

        if (isOwner(role)) {
            return toResponse(appt);
        }

        throw new ForbiddenException("Not allowed to view this appointment");
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponse> myAppointments(Long ownerId) {
        return appointmentRepo.findMyAppointments(ownerId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponse> doctorAppointments(Long vetId, Long userId, String role) {

        if (!(isVet(role) || isAdmin(role))) {
            throw new ForbiddenException("Only VET/ADMIN can view doctor appointments");
        }


        return appointmentRepo.findByVetIdOrderByCreatedAtDesc(vetId)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public AppointmentResponse cancel(Long appointmentId, Long userId, String role) {

        Appointment appt = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + appointmentId));

        if (!isAdmin(role) && !isOwner(role)) {
            throw new ForbiddenException("Only OWNER/ADMIN can cancel appointments");
        }

        if (appt.getStatus() == AppointmentStatus.CANCELLED) {
            return toResponse(appt);
        }

        if (appt.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Completed appointment cannot be cancelled: " + appointmentId);
        }

        DoctorSlot slot = slotRepo.findByIdForUpdate(appt.getSlot().getSlotId())
                .orElseThrow(() -> new NotFoundException("Slot not found: " + appt.getSlot().getSlotId()));

        slot.setIsAvailable(true);
        slotRepo.save(slot);

        appt.setStatus(AppointmentStatus.CANCELLED);
        return toResponse(appointmentRepo.save(appt));
    }

    @Override
    @Transactional
    public AppointmentResponse updateStatus(Long appointmentId, AppointmentStatus status, Long userId, String role) {

        if (!(isVet(role) || isAdmin(role))) {
            throw new ForbiddenException("Only VET/ADMIN can update appointment status");
        }

        Appointment appt = appointmentRepo.findById(appointmentId)
                .orElseThrow(() -> new NotFoundException("Appointment not found: " + appointmentId));

        if (appt.getStatus() == AppointmentStatus.CANCELLED) {
            throw new BadRequestException("Cannot update a cancelled appointment");
        }
        if (appt.getStatus() == AppointmentStatus.COMPLETED) {
            throw new BadRequestException("Cannot update a completed appointment");
        }

        if (status == AppointmentStatus.CANCELLED) {
            DoctorSlot slot = slotRepo.findByIdForUpdate(appt.getSlot().getSlotId())
                    .orElseThrow(() -> new NotFoundException("Slot not found: " + appt.getSlot().getSlotId()));

            slot.setIsAvailable(true);
            slotRepo.save(slot);
        }

        if (status == AppointmentStatus.COMPLETED) {
            appt.setActualEndTime(java.time.LocalDateTime.now());
        }

        appt.setStatus(status);
        return toResponse(appointmentRepo.save(appt));
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentResponse> adminAllAppointments() {
        return appointmentRepo.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private AppointmentResponse toResponse(Appointment a) {
        DoctorSlot s = a.getSlot();

        return AppointmentResponse.builder()
                .appointmentId(a.getAppointmentId())
                .petId(a.getPetId())
                .vetId(a.getVetId())
                .appointmentTypeId(a.getAppointmentTypeId())
                .slotId(s.getSlotId())
                .slotDate(s.getSlotDate())
                .slotStartTime(s.getStartTime())
                .slotEndTime(s.getEndTime())
                .appointmentMode(a.getAppointmentMode())
                .status(a.getStatus())
                .actualStartTime(a.getActualStartTime())
                .actualEndTime(a.getActualEndTime())
                .createdAt(a.getCreatedAt())
                .build();
    }
}