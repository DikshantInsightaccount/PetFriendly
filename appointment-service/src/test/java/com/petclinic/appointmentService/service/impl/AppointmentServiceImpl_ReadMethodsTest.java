package com.petclinic.appointmentService.service.impl;

import com.petclinic.appointmentService.dto.AppointmentResponse;
import com.petclinic.appointmentService.entity.Appointment;
import com.petclinic.appointmentService.entity.AppointmentMode;
import com.petclinic.appointmentService.entity.AppointmentStatus;
import com.petclinic.appointmentService.entity.DoctorSlot;
import com.petclinic.appointmentService.exception.ForbiddenException;
import com.petclinic.appointmentService.exception.NotFoundException;
import com.petclinic.appointmentService.repository.AppointmentRepository;
import com.petclinic.appointmentService.repository.DoctorSlotRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.lang.reflect.Field;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceImpl_ReadMethodsTest {

    @Mock
    private AppointmentRepository appointmentRepo;

    @Mock
    private DoctorSlotRepository slotRepo;

    @InjectMocks
    private AppointmentServiceImpl service;

    private static final Long OWNER_ID = 10L;
    private static final Long VET_ID = 21L;
    private static final Long PET_ID = 5L;

    /* ================= getById ================= */

    @Test
    void getById_notFound() {
        when(appointmentRepo.findById(1L)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class,
                () -> service.getById(1L, OWNER_ID, "OWNER"));
    }

    @Test
    void getById_admin() {
        Appointment appt = realAppointment(1L, PET_ID, VET_ID);

        when(appointmentRepo.findById(1L))
                .thenReturn(Optional.of(appt));

        AppointmentResponse res =
                service.getById(1L, 999L, "ADMIN");

        assertNotNull(res);
    }

    @Test
    void getById_vet() {
        Appointment appt = realAppointment(1L, PET_ID, VET_ID);

        when(appointmentRepo.findById(1L))
                .thenReturn(Optional.of(appt));

        AppointmentResponse res =
                service.getById(1L, VET_ID, "VET");

        assertNotNull(res);
    }

    @Test
    void getById_owner() {
        Appointment appt = realAppointment(1L, PET_ID, VET_ID);

        when(appointmentRepo.findById(1L))
                .thenReturn(Optional.of(appt));

        AppointmentResponse res =
                service.getById(1L, OWNER_ID, "OWNER");

        assertNotNull(res);
    }

    @Test
    void getById_forbidden() {
        Appointment appt = realAppointment(1L, PET_ID, VET_ID);

        when(appointmentRepo.findById(1L))
                .thenReturn(Optional.of(appt));

        assertThrows(ForbiddenException.class,
                () -> service.getById(1L, OWNER_ID, "GUEST"));
    }

    /* ================= myAppointments ================= */

    @Test
    void myAppointments_owner() {
        when(appointmentRepo.findMyAppointments(OWNER_ID))
                .thenReturn(List.of(realAppointment(1L, PET_ID, VET_ID)));

        List<AppointmentResponse> list =
                service.myAppointments(OWNER_ID, "OWNER");

        assertEquals(1, list.size());
    }

    @Test
    void myAppointments_vet() {
        when(appointmentRepo.findByVetIdOrderByCreatedAtDesc(VET_ID))
                .thenReturn(List.of(realAppointment(1L, PET_ID, VET_ID)));

        List<AppointmentResponse> list =
                service.myAppointments(VET_ID, "VET");

        assertEquals(1, list.size());
    }

    @Test
    void myAppointments_forbidden() {
        assertThrows(ForbiddenException.class,
                () -> service.myAppointments(OWNER_ID, "ADMINX"));
    }

    /* ================= doctorAppointments ================= */

    @Test
    void doctorAppointments_forbidden() {
        assertThrows(ForbiddenException.class,
                () -> service.doctorAppointments(VET_ID, OWNER_ID, "OWNER"));
    }

    @Test
    void doctorAppointments_vet() {
        when(appointmentRepo.findByVetIdOrderByCreatedAtDesc(VET_ID))
                .thenReturn(List.of(realAppointment(1L, PET_ID, VET_ID)));

        List<AppointmentResponse> list =
                service.doctorAppointments(VET_ID, OWNER_ID, "VET");

        assertEquals(1, list.size());
    }

    @Test
    void doctorAppointments_admin() {
        when(appointmentRepo.findByVetIdOrderByCreatedAtDesc(VET_ID))
                .thenReturn(List.of(realAppointment(1L, PET_ID, VET_ID)));

        List<AppointmentResponse> list =
                service.doctorAppointments(VET_ID, 999L, "ADMIN");

        assertEquals(1, list.size());
    }

    /* ================= appointmentsByPet ================= */

    @Test
    void appointmentsByPet_admin() {
        when(appointmentRepo.findByPetIdOrderByCreatedAtDesc(PET_ID))
                .thenReturn(List.of(realAppointment(1L, PET_ID, VET_ID)));

        List<AppointmentResponse> list =
                service.appointmentsByPet(PET_ID, 999L, "ADMIN");

        assertEquals(1, list.size());
    }

    @Test
    void appointmentsByPet_owner() {
        when(appointmentRepo.findAppointmentsForOwnerPet(PET_ID, OWNER_ID))
                .thenReturn(List.of(realAppointment(1L, PET_ID, VET_ID)));

        List<AppointmentResponse> list =
                service.appointmentsByPet(PET_ID, OWNER_ID, "OWNER");

        assertEquals(1, list.size());
    }

    @Test
    void appointmentsByPet_vet() {
        when(appointmentRepo.findByPetIdOrderByCreatedAtDesc(PET_ID))
                .thenReturn(List.of(realAppointment(1L, PET_ID, VET_ID)));

        List<AppointmentResponse> list =
                service.appointmentsByPet(PET_ID, VET_ID, "VET");

        assertEquals(1, list.size());
    }

    @Test
    void appointmentsByPet_forbidden() {
        assertThrows(ForbiddenException.class,
                () -> service.appointmentsByPet(PET_ID, OWNER_ID, "GUEST"));
    }

    /* ================= helpers ================= */

    private DoctorSlot realSlot(Long slotId, Long vetId) {

        DoctorSlot slot = DoctorSlot.builder()
                .vetId(vetId)
                .slotDate(LocalDate.now().plusDays(1))
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(10, 30))
                .isAvailable(true)
                .build();

        setField(slot, "slotId", slotId);

        return slot;
    }

    private Appointment realAppointment(Long apptId,
                                        Long petId,
                                        Long vetId) {

        DoctorSlot slot = realSlot(99L, vetId);

        Appointment appt = Appointment.builder()
                .petId(petId)
                .vetId(vetId)
                .appointmentTypeId(1L)
                .slot(slot)
                .appointmentMode(AppointmentMode.OFFLINE)
                .status(AppointmentStatus.BOOKED)
                .ownerId(OWNER_ID)
                .build();

        setField(appt, "appointmentId", apptId);
        setField(appt, "createdAt", LocalDateTime.now());

        return appt;
    }

    private void setField(Object target,
                          String fieldName,
                          Object value) {

        try {
            Field f = target.getClass()
                    .getDeclaredField(fieldName);

            f.setAccessible(true);
            f.set(target, value);

        } catch (Exception e) {
            throw new RuntimeException("Reflection error", e);
        }
    }
}