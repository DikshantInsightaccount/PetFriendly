package com.petclinic.appointmentService.service.impl;
import com.petclinic.appointmentService.dto.AppointmentResponse;
import com.petclinic.appointmentService.dto.CreateAppointmentRequest;
import com.petclinic.appointmentService.entity.Appointment;
import com.petclinic.appointmentService.entity.AppointmentMode;
import com.petclinic.appointmentService.entity.AppointmentStatus;
import com.petclinic.appointmentService.entity.DoctorSlot;
import com.petclinic.appointmentService.exception.BadRequestException;
import com.petclinic.appointmentService.exception.ConflictException;
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
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceImplTest {

    @Mock private AppointmentRepository appointmentRepo;
    @Mock private DoctorSlotRepository slotRepo;

    @InjectMocks
    private AppointmentServiceImpl service;

    private static final Long OWNER_ID = 10L;
    private static final Long VET_ID   = 21L;
    private static final Long PET_ID   = 5L;
    private static final Long SLOT_ID  = 99L;



    @Test
    void book_shouldThrowForbidden_whenRoleNotOwner() {
        CreateAppointmentRequest req = mock(CreateAppointmentRequest.class);

        assertThrows(ForbiddenException.class, () -> service.book(OWNER_ID, "VET", req));

        verifyNoInteractions(slotRepo);
        verify(appointmentRepo, never()).save(any());
    }

    @Test
    void book_shouldThrowForbidden_whenPetNotOwnedOrDeleted() {
        CreateAppointmentRequest req = mock(CreateAppointmentRequest.class);
        when(req.getPetId()).thenReturn(PET_ID);

        when(appointmentRepo.countActivePetForOwner(PET_ID, OWNER_ID)).thenReturn(0L);

        assertThrows(ForbiddenException.class, () -> service.book(OWNER_ID, "OWNER", req));

        verifyNoInteractions(slotRepo);
        verify(appointmentRepo, never()).save(any());
    }

    @Test
    void book_shouldThrowNotFound_whenSlotMissing() {
        CreateAppointmentRequest req = mock(CreateAppointmentRequest.class);
        when(req.getPetId()).thenReturn(PET_ID);
        when(req.getSlotId()).thenReturn(SLOT_ID);

        when(appointmentRepo.countActivePetForOwner(PET_ID, OWNER_ID)).thenReturn(1L);
        when(slotRepo.findByIdForUpdate(SLOT_ID)).thenReturn(Optional.empty());

        assertThrows(NotFoundException.class, () -> service.book(OWNER_ID, "OWNER", req));
        verify(appointmentRepo, never()).save(any());
    }

    @Test
    void book_shouldThrowConflict_whenSlotNotAvailable() {
        CreateAppointmentRequest req = mock(CreateAppointmentRequest.class);
        when(req.getPetId()).thenReturn(PET_ID);
        when(req.getSlotId()).thenReturn(SLOT_ID);

        DoctorSlot slot = mock(DoctorSlot.class);
        when(slot.isAvailable()).thenReturn(false);
        when(slot.getSlotId()).thenReturn(SLOT_ID); // used in error msg

        when(appointmentRepo.countActivePetForOwner(PET_ID, OWNER_ID)).thenReturn(1L);
        when(slotRepo.findByIdForUpdate(SLOT_ID)).thenReturn(Optional.of(slot));

        assertThrows(ConflictException.class, () -> service.book(OWNER_ID, "OWNER", req));

        verify(appointmentRepo, never()).save(any());
        verify(slotRepo, never()).save(any());
    }

    @Test
    void book_shouldThrowBadRequest_whenSlotVetMismatch() {
        CreateAppointmentRequest req = mock(CreateAppointmentRequest.class);
        when(req.getPetId()).thenReturn(PET_ID);
        when(req.getSlotId()).thenReturn(SLOT_ID);
        when(req.getVetId()).thenReturn(777L);

        DoctorSlot slot = mock(DoctorSlot.class);
        when(slot.isAvailable()).thenReturn(true);
        when(slot.getVetId()).thenReturn(VET_ID);

        when(appointmentRepo.countActivePetForOwner(PET_ID, OWNER_ID)).thenReturn(1L);
        when(slotRepo.findByIdForUpdate(SLOT_ID)).thenReturn(Optional.of(slot));

        assertThrows(BadRequestException.class, () -> service.book(OWNER_ID, "OWNER", req));

        verify(appointmentRepo, never()).save(any());
        verify(slotRepo, never()).save(any());
    }

    @Test
    void book_shouldThrowConflict_whenSlotAlreadyBooked() {
        CreateAppointmentRequest req = mock(CreateAppointmentRequest.class);
        when(req.getPetId()).thenReturn(PET_ID);
        when(req.getSlotId()).thenReturn(SLOT_ID);
        when(req.getVetId()).thenReturn(VET_ID);

        DoctorSlot slot = mock(DoctorSlot.class);
        when(slot.isAvailable()).thenReturn(true);
        when(slot.getVetId()).thenReturn(VET_ID);

        when(appointmentRepo.countActivePetForOwner(PET_ID, OWNER_ID)).thenReturn(1L);
        when(slotRepo.findByIdForUpdate(SLOT_ID)).thenReturn(Optional.of(slot));
        when(appointmentRepo.existsBySlot_SlotId(SLOT_ID)).thenReturn(true);

        assertThrows(ConflictException.class, () -> service.book(OWNER_ID, "OWNER", req));

        verify(appointmentRepo, never()).save(any());
        verify(slotRepo, never()).save(any());
    }

    @Test
    void book_shouldSucceed_andMarkSlotUnavailable_andReturnResponse() {
        CreateAppointmentRequest req = mock(CreateAppointmentRequest.class);
        when(req.getPetId()).thenReturn(PET_ID);
        when(req.getVetId()).thenReturn(VET_ID);
        when(req.getSlotId()).thenReturn(SLOT_ID);
        when(req.getAppointmentTypeId()).thenReturn(2L);
        when(req.getAppointmentMode()).thenReturn(AppointmentMode.OFFLINE);

        DoctorSlot slot = realSlot(SLOT_ID, VET_ID, true);

        when(appointmentRepo.countActivePetForOwner(PET_ID, OWNER_ID)).thenReturn(1L);
        when(slotRepo.findByIdForUpdate(SLOT_ID)).thenReturn(Optional.of(slot));
        when(appointmentRepo.existsBySlot_SlotId(SLOT_ID)).thenReturn(false);

        when(slotRepo.save(slot)).thenReturn(slot);
        when(appointmentRepo.save(any(Appointment.class))).thenAnswer(inv -> inv.getArgument(0));

        AppointmentResponse resp = service.book(OWNER_ID, "OWNER", req);

        assertEquals(PET_ID, resp.getPetId());
        assertEquals(VET_ID, resp.getVetId());
        assertEquals(SLOT_ID, resp.getSlotId());
        assertEquals(AppointmentStatus.BOOKED, resp.getStatus());
        assertFalse(slot.isAvailable()); // slot setAvailable(false) happened
    }



    @Test
    void cancel_shouldSucceed_andFreeSlot_andSetCancelled() {
        DoctorSlot slot = realSlot(SLOT_ID, VET_ID, false);
        Appointment appt = realAppointment(1L, PET_ID, VET_ID, slot, AppointmentStatus.BOOKED);

        when(appointmentRepo.findById(1L)).thenReturn(Optional.of(appt));
        when(slotRepo.findByIdForUpdate(SLOT_ID)).thenReturn(Optional.of(slot));
        when(slotRepo.save(slot)).thenReturn(slot);
        when(appointmentRepo.save(appt)).thenReturn(appt);

        AppointmentResponse resp = service.cancel(1L, OWNER_ID, "OWNER");

        assertEquals(AppointmentStatus.CANCELLED, resp.getStatus());
        assertTrue(slot.isAvailable());
    }


    @Test
    void updateStatus_shouldFreeSlot_whenCancelling() {
        DoctorSlot slot = realSlot(SLOT_ID, VET_ID, false);
        Appointment appt = realAppointment(1L, PET_ID, VET_ID, slot, AppointmentStatus.BOOKED);

        when(appointmentRepo.findById(1L)).thenReturn(Optional.of(appt));
        when(slotRepo.findByIdForUpdate(SLOT_ID)).thenReturn(Optional.of(slot));
        when(slotRepo.save(slot)).thenReturn(slot);
        when(appointmentRepo.save(appt)).thenReturn(appt);

        AppointmentResponse resp = service.updateStatus(1L, AppointmentStatus.CANCELLED, OWNER_ID, "VET");

        assertEquals(AppointmentStatus.CANCELLED, resp.getStatus());
        assertTrue(slot.isAvailable());
    }

    @Test
    void updateStatus_shouldSetActualEndTime_whenCompleting() {
        DoctorSlot slot = realSlot(SLOT_ID, VET_ID, false);
        Appointment appt = realAppointment(1L, PET_ID, VET_ID, slot, AppointmentStatus.BOOKED);

        when(appointmentRepo.findById(1L)).thenReturn(Optional.of(appt));
        when(appointmentRepo.save(appt)).thenReturn(appt);

        AppointmentResponse resp = service.updateStatus(1L, AppointmentStatus.COMPLETED, OWNER_ID, "VET");

        assertEquals(AppointmentStatus.COMPLETED, resp.getStatus());
        assertNotNull(resp.getActualEndTime());
    }


    @Test
    void adminAllAppointments_shouldReturnAll() {
        DoctorSlot slot = realSlot(SLOT_ID, VET_ID, true);
        Appointment appt = realAppointment(1L, PET_ID, VET_ID, slot, AppointmentStatus.BOOKED);

        when(appointmentRepo.findAll()).thenReturn(List.of(appt));

        List<AppointmentResponse> result = service.adminAllAppointments();

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getAppointmentId());
    }

    @Test
    void appointmentsByPet_owner_shouldCallOwnerScopedQuery() {
        DoctorSlot slot = realSlot(SLOT_ID, VET_ID, true);
        Appointment appt = realAppointment(1L, PET_ID, VET_ID, slot, AppointmentStatus.BOOKED);

        when(appointmentRepo.findAppointmentsForOwnerPet(PET_ID, OWNER_ID)).thenReturn(List.of(appt));

        List<AppointmentResponse> result = service.appointmentsByPet(PET_ID, OWNER_ID, "OWNER");

        assertEquals(1, result.size());
        verify(appointmentRepo).findAppointmentsForOwnerPet(PET_ID, OWNER_ID);
        verify(appointmentRepo, never()).findByPetIdOrderByCreatedAtDesc(anyLong());
    }



    private DoctorSlot realSlot(Long slotId, Long vetId, boolean available) {
        DoctorSlot slot = DoctorSlot.builder()
                .vetId(vetId)
                .slotDate(LocalDate.now().plusDays(1))
                .startTime(LocalTime.of(10, 0))
                .endTime(LocalTime.of(10, 30))
                .isAvailable(available)
                .build();

        setField(slot, "slotId", slotId);
        return slot;
    }

    private Appointment realAppointment(Long apptId, Long petId, Long vetId, DoctorSlot slot, AppointmentStatus status) {
        Appointment appt = Appointment.builder()
                .petId(petId)
                .vetId(vetId)
                .appointmentTypeId(1L)
                .slot(slot)
                .appointmentMode(AppointmentMode.OFFLINE)
                .status(status)
                .ownerId(OWNER_ID)
                .build();

        setField(appt, "appointmentId", apptId);

        if (getField(appt, "createdAt") == null) {
            setField(appt, "createdAt", LocalDateTime.now());
        }
        return appt;
    }

    private void setField(Object target, String fieldName, Object value) {
        try {
            Field f = target.getClass().getDeclaredField(fieldName);
            f.setAccessible(true);
            f.set(target, value);
        } catch (Exception e) {
            throw new RuntimeException("Failed to set field: " + fieldName, e);
        }
    }

    private Object getField(Object target, String fieldName) {
        try {
            Field f = target.getClass().getDeclaredField(fieldName);
            f.setAccessible(true);
            return f.get(target);
        } catch (Exception e) {
            return null;
        }
    }
}


