package com.petclinic.appointmentService.scheduler;

import com.petclinic.appointmentService.dto.GenerateSlotsRequest;
import com.petclinic.appointmentService.repository.DoctorSlotRepository;
import com.petclinic.appointmentService.service.SlotService;
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

    /**
     * Runs every day at midnight.
     * Generates future slots ONLY after application startup.
     * Safe because DB is already initialized.
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void ensure30DayWindow() {

        // ⚠️ Temporary single-vet logic (OK for now)
        Long vetId = 1L;

        LocalDate today = LocalDate.now();
        LocalDate requiredLastDate = today.plusDays(WINDOW_DAYS);

        LocalDate lastSlotDate = slotRepo.findLastSlotDate(vetId);

        // ✅ If no slots exist yet, do nothing
        if (lastSlotDate == null) {
            return;
        }

        if (!lastSlotDate.isBefore(requiredLastDate)) {
            return;
        }

        int daysToGenerate = (int) ChronoUnit.DAYS.between(
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

        // ✅ ADMIN role used internally
        slotService.generateSlots(req, null, "ADMIN");
    }
}