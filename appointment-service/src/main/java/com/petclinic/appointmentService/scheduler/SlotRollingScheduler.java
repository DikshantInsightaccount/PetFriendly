package com.petclinic.appointmentService.scheduler;

import com.petclinic.appointmentService.dto.GenerateSlotsRequest;
import com.petclinic.appointmentService.repository.DoctorSlotRepository;
import com.petclinic.appointmentService.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class SlotRollingScheduler {

    private static final int WINDOW_DAYS = 30;

    private final SlotService slotService;
    private final DoctorSlotRepository slotRepo;

    /**
     * Runs every day at midnight.
     * Ensures slots exist for the next 30 days
     * based on saved vet working hours.
     */
    @Scheduled(cron = "0 0 0 * * *")
    public void ensure30DayWindow() {

        // ✅ TODO: replace with looping all vets later
        Long vetId = 1L;

        LocalDate today = LocalDate.now();
        LocalDate requiredLastDate = today.plusDays(WINDOW_DAYS);

        LocalDate lastSlotDate = slotRepo.findLastSlotDate(vetId);

        // ✅ If no slots exist yet, admin-triggered generation will handle it
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
                .slotMinutes(30)
                .build();

        // ✅ ADMIN role used internally
        slotService.generateSlots(req, null, "ADMIN");
    }
}