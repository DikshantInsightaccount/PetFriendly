package com.petclinic.appointmentService.scheduler;
import com.petclinic.appointmentService.dto.GenerateSlotsRequest;
import com.petclinic.appointmentService.repository.DoctorSlotRepository;
import com.petclinic.appointmentService.service.SlotService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;

import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class SlotRollingSchedulerTest {

    @Mock
    private SlotService slotService;

    @Mock
    private DoctorSlotRepository slotRepo;

    @InjectMocks
    private SlotRollingScheduler scheduler;


    @Test
    void shouldDoNothing_whenNoSlotsExist() {

        when(slotRepo.findLastSlotDate(1L)).thenReturn(null);

        scheduler.ensure30DayWindow();

        verify(slotService, never()).generateSlots(any(), any(), any());
    }


    @Test
    void shouldDoNothing_whenAlreadyWithinWindow() {

        LocalDate today = LocalDate.now();


        when(slotRepo.findLastSlotDate(1L))
                .thenReturn(today.plusDays(30));

        scheduler.ensure30DayWindow();

        verify(slotService, never()).generateSlots(any(), any(), any());
    }

    @Test
    void shouldGenerateSlots_whenWindowNotComplete() {

        LocalDate today = LocalDate.now();

        LocalDate lastSlotDate = today.plusDays(10); // gap exists

        when(slotRepo.findLastSlotDate(1L))
                .thenReturn(lastSlotDate);

        scheduler.ensure30DayWindow();

        ArgumentCaptor<GenerateSlotsRequest> captor =
                ArgumentCaptor.forClass(GenerateSlotsRequest.class);

        verify(slotService).generateSlots(captor.capture(), isNull(), eq("ADMIN"));

        GenerateSlotsRequest req = captor.getValue();

        assertEquals(1L, req.getVetId());

        assertEquals(
                lastSlotDate.plusDays(1),
                req.getStartDate()
        );

        int expectedDays =
                (int) java.time.temporal.ChronoUnit.DAYS.between(
                        lastSlotDate.plusDays(1),
                        today.plusDays(30)
                );

        assertEquals(expectedDays, req.getDays());
        assertEquals(30, req.getSlotMinutes());
    }


    @Test
    void shouldNotGenerate_whenExactlyAtBoundary() {

        LocalDate today = LocalDate.now();


        when(slotRepo.findLastSlotDate(1L))
                .thenReturn(today.plusDays(29).plusDays(1)); // == 30

        scheduler.ensure30DayWindow();

        verify(slotService, never()).generateSlots(any(), any(), any());
    }
}

