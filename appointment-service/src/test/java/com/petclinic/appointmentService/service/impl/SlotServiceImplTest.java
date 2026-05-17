package com.petclinic.appointmentService.service.impl;

import com.petclinic.appointmentService.dto.GenerateSlotsRequest;
import com.petclinic.appointmentService.dto.SlotResponse;
import com.petclinic.appointmentService.entity.DoctorSlot;
import com.petclinic.appointmentService.entity.VetBreak;
import com.petclinic.appointmentService.entity.VetWorkingHour;
import com.petclinic.appointmentService.exception.BadRequestException;
import com.petclinic.appointmentService.exception.ForbiddenException;
import com.petclinic.appointmentService.exception.NotFoundException;
import com.petclinic.appointmentService.repository.DoctorSlotRepository;
import com.petclinic.appointmentService.repository.VetBreakRepository;
import com.petclinic.appointmentService.repository.VetWorkingHourRepository;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;


@ExtendWith(MockitoExtension.class)
class SlotServiceImplTest {

    @Mock private DoctorSlotRepository slotRepo;
    @Mock private VetWorkingHourRepository workingHourRepo;
    @Mock private VetBreakRepository breakRepo;

    @InjectMocks
    private SlotServiceImpl service;

    private static final Long VET_ID = 1L;


    private static final LocalDate MONDAY = LocalDate.of(2026, 5, 18);

    /* =========================================================
       GENERATE SLOTS
       ========================================================= */

    @Test
    void generateSlots_shouldThrowForbidden_whenInvalidRole() {
        GenerateSlotsRequest req = mock(GenerateSlotsRequest.class);

        assertThrows(ForbiddenException.class,
                () -> service.generateSlots(req, 1L, "OWNER"));

        verifyNoInteractions(workingHourRepo, breakRepo, slotRepo);
    }

    @Test
    void generateSlots_shouldThrowBadRequest_whenDaysInvalid() {
        GenerateSlotsRequest req = mock(GenerateSlotsRequest.class);
        when(req.getDays()).thenReturn(0);

        assertThrows(BadRequestException.class,
                () -> service.generateSlots(req, 1L, "ADMIN"));

        verifyNoInteractions(workingHourRepo, breakRepo, slotRepo);
    }


    @Test
    void generateSlots_shouldThrowBadRequest_whenSlotMinutesInvalid() {
        GenerateSlotsRequest req = mock(GenerateSlotsRequest.class);
        when(req.getDays()).thenReturn(7);
        when(req.getSlotMinutes()).thenReturn(2);

        assertThrows(BadRequestException.class,
                () -> service.generateSlots(req, 1L, "ADMIN"));

        verifyNoInteractions(workingHourRepo, breakRepo, slotRepo);
    }

    @Test
    void TestSlots_shouldThrowBadRequest_whenNoWorkingHours() {
        GenerateSlotsRequest req = mock(GenerateSlotsRequest.class);

        when(req.getDays()).thenReturn(1);
        when(req.getSlotMinutes()).thenReturn(30);
        when(req.getVetId()).thenReturn(VET_ID);

        when(workingHourRepo.findByVetId(VET_ID)).thenReturn(List.of());

        assertThrows(BadRequestException.class,
                () -> service.generateSlots(req, 1L, "ADMIN"));

        verify(workingHourRepo).findByVetId(VET_ID);
        verifyNoInteractions(breakRepo, slotRepo);
    }



    @Test
    void generateSlots_shouldCreateSlots_success() {
        GenerateSlotsRequest req = req(MONDAY, 1, 30);

        VetWorkingHour wh = workingHour("MON", LocalTime.of(10, 0), LocalTime.of(11, 0));

        when(workingHourRepo.findByVetId(VET_ID)).thenReturn(List.of(wh));
        when(breakRepo.findByVetId(VET_ID)).thenReturn(List.of());

        when(slotRepo.existsByVetIdAndSlotDateAndStartTimeAndEndTime(
                eq(VET_ID), eq(MONDAY), any(), any()
        )).thenReturn(false);

        service.generateSlots(req, 1L, "ADMIN");

        // 10:00-10:30 and 10:30-11:00 => 2 saves
        verify(slotRepo, times(2)).save(any(DoctorSlot.class));
    }

    @Test
    void generateSlots_shouldSkipBreaks() {
        GenerateSlotsRequest req = req(MONDAY, 1, 30);

        VetWorkingHour wh = workingHour("MON", LocalTime.of(10, 0), LocalTime.of(11, 0));

        // Break overlaps second slot (10:30-11:00)
        VetBreak br = breakSlot(LocalTime.of(10, 30), LocalTime.of(11, 0));

        when(workingHourRepo.findByVetId(VET_ID)).thenReturn(List.of(wh));
        when(breakRepo.findByVetId(VET_ID)).thenReturn(List.of(br));

        when(slotRepo.existsByVetIdAndSlotDateAndStartTimeAndEndTime(
                eq(VET_ID), eq(MONDAY), any(), any()
        )).thenReturn(false);

        service.generateSlots(req, 1L, "ADMIN");

        // Only first slot should be saved
        verify(slotRepo, times(1)).save(any(DoctorSlot.class));
    }

    @Test
    void generateSlots_shouldSkipExistingSlots() {
        GenerateSlotsRequest req = req(MONDAY, 1, 30);

        VetWorkingHour wh = workingHour("MON", LocalTime.of(10, 0), LocalTime.of(11, 0));

        when(workingHourRepo.findByVetId(VET_ID)).thenReturn(List.of(wh));
        when(breakRepo.findByVetId(VET_ID)).thenReturn(List.of());

        // Every slot already exists
        when(slotRepo.existsByVetIdAndSlotDateAndStartTimeAndEndTime(
                eq(VET_ID), eq(MONDAY), any(), any()
        )).thenReturn(true);

        service.generateSlots(req, 1L, "ADMIN");

        verify(slotRepo, never()).save(any());
    }

    /* =========================================================
       GET AVAILABLE SLOTS
       ========================================================= */

    @Test
    void getAvailableSlots_shouldReturnMappedResponse() {
        DoctorSlot slot = slotEntity(1L, VET_ID, MONDAY, LocalTime.of(10, 0), LocalTime.of(10, 30), true);

        when(slotRepo.findByVetIdAndSlotDateAndIsAvailableTrueOrderByStartTime(VET_ID, MONDAY))
                .thenReturn(List.of(slot));

        List<SlotResponse> result = service.getAvailableSlots(VET_ID, MONDAY);

        assertEquals(1, result.size());
        assertEquals(1L, result.get(0).getSlotId());
        assertEquals(VET_ID, result.get(0).getVetId());
    }


    @Test
    void getSlot_shouldReturnSlot_whenFound() {
        DoctorSlot slot = slotEntity(1L, VET_ID, MONDAY, LocalTime.of(10, 0), LocalTime.of(10, 30), true);

        when(slotRepo.findById(1L)).thenReturn(Optional.of(slot));

        SlotResponse res = service.getSlot(1L);

        assertEquals(1L, res.getSlotId());
        assertEquals(VET_ID, res.getVetId());
    }

    @Test
    void getSlot_shouldThrowNotFound_whenMissing() {
        when(slotRepo.findById(1L)).thenReturn(Optional.empty());
        assertThrows(NotFoundException.class, () -> service.getSlot(1L));
    }


    private GenerateSlotsRequest req(LocalDate startDate, int days, int minutes) {
        GenerateSlotsRequest req = mock(GenerateSlotsRequest.class);

        when(req.getVetId()).thenReturn(VET_ID);
        when(req.getStartDate()).thenReturn(startDate);
        when(req.getDays()).thenReturn(days);
        when(req.getSlotMinutes()).thenReturn(minutes);

        return req;
    }

    private VetWorkingHour workingHour(String day, LocalTime start, LocalTime end) {
        VetWorkingHour wh = mock(VetWorkingHour.class);
        when(wh.getDayOfWeek()).thenReturn(day);
        when(wh.getStartTime()).thenReturn(start);
        when(wh.getEndTime()).thenReturn(end);
        return wh;
    }

    private VetBreak breakSlot(LocalTime start, LocalTime end) {
        VetBreak br = mock(VetBreak.class);
        when(br.getStartTime()).thenReturn(start);
        when(br.getEndTime()).thenReturn(end);
        return br;
    }

    private DoctorSlot slotEntity(Long slotId, Long vetId, LocalDate date, LocalTime start, LocalTime end, boolean available) {
        DoctorSlot slot = mock(DoctorSlot.class);
        when(slot.getSlotId()).thenReturn(slotId);
        when(slot.getVetId()).thenReturn(vetId);
        when(slot.getSlotDate()).thenReturn(date);
        when(slot.getStartTime()).thenReturn(start);
        when(slot.getEndTime()).thenReturn(end);
        when(slot.isAvailable()).thenReturn(available);
        return slot;
    }
}