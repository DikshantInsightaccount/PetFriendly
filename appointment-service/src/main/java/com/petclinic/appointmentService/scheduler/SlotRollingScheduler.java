package com.petclinic.appointmentService.scheduler;

import com.petclinic.appointmentService.dto.GenerateSlotsRequest;
import com.petclinic.appointmentService.repository.DoctorSlotRepository;
import com.petclinic.appointmentService.service.SlotService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class SlotRollingScheduler {

    private static final int WINDOW_DAYS = 30;

    private final SlotService slotService;
    private final DoctorSlotRepository slotRepo;

    // Runs every day at 00:00
    @Scheduled(cron = "0 0 0 * * *")
    public void ensure30DayWindow() {

        // ✅ for now, single vet
        Long vetId = 1L;

        LocalDate today = LocalDate.now();
        LocalDate requiredLastDate = today.plusDays(WINDOW_DAYS);

        LocalDate lastSlotDate = slotRepo.findLastSlotDate(vetId);

        // First-time / empty DB case
        if (lastSlotDate == null) {
            lastSlotDate = today.minusDays(1);
        }

        if (!lastSlotDate.isBefore(requiredLastDate)) {
            // ✅ we already have >= 30 days
            return;
        }

        int daysToGenerate =
                (int) ChronoUnit.DAYS.between(
                        lastSlotDate.plusDays(1),
                        requiredLastDate
                );

        GenerateSlotsRequest req = GenerateSlotsRequest.builder()
                .vetId(vetId)
                .startDate(lastSlotDate.plusDays(1))
                .days(daysToGenerate)
                .dayStartTime(LocalTime.of(10, 0))
                .dayEndTime(LocalTime.of(18, 0))
                .slotMinutes(30)
                .build();

        // ✅ use ADMIN internally
        slotService.generateSlots(req, null, "ADMIN");
    }
    @PostConstruct
    public void backfillOnStartup() {
        ensure30DayWindow();
    }
}