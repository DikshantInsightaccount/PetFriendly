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
import com.petclinic.appointmentService.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SlotServiceImpl implements SlotService {

    private final DoctorSlotRepository slotRepo;
    private final VetWorkingHourRepository workingHourRepo;
    private final VetBreakRepository breakRepo;

    private boolean isAdmin(String role) {
        return "ADMIN".equalsIgnoreCase(role);
    }

    private boolean isVet(String role) {
        return "VET".equalsIgnoreCase(role);
    }

    @Override
    @Transactional
    public void generateSlots(GenerateSlotsRequest req, Long userId, String role) {

        if (!(isVet(role) || isAdmin(role))) {
            throw new ForbiddenException("Only VET or ADMIN can generate slots");
        }

        if (req.getDays() == null || req.getDays() <= 0) {
            throw new BadRequestException("days must be greater than 0");
        }

        if (req.getSlotMinutes() == null || req.getSlotMinutes() < 5) {
            throw new BadRequestException("slotMinutes must be at least 5");
        }

        List<VetWorkingHour> workingHours = workingHourRepo.findByVetId(req.getVetId());
        if (workingHours.isEmpty()) {
            throw new BadRequestException("No working hours found for vetId=" + req.getVetId());
        }

        List<VetBreak> breaks = breakRepo.findByVetId(req.getVetId());

        Map<String, VetWorkingHour> workingHourMap = workingHours.stream()
                .collect(Collectors.toMap(VetWorkingHour::getDayOfWeek, wh -> wh, (a, b) -> a));

        for (int i = 0; i < req.getDays(); i++) {
            LocalDate date = req.getStartDate().plusDays(i);

            // 1) Is this a working day?
            String dayCode = toDayCode(date.getDayOfWeek());
            VetWorkingHour wh = workingHourMap.get(dayCode);
            if (wh == null) {
                continue; // not a working day
            }

            // 2) If on leave -> skip whole day
            // TODO: when vet_leaves schema is wired, check leave here
            if (isVetOnLeave(req.getVetId(), date)) {
                continue;
            }

            // 3) Generate slots inside working hours
            LocalTime cursor = wh.getStartTime();
            LocalTime workEnd = wh.getEndTime();

            while (!cursor.plusMinutes(req.getSlotMinutes()).isAfter(workEnd)) {
                LocalTime slotEnd = cursor.plusMinutes(req.getSlotMinutes());

                // 4) Skip if overlaps break
                if (overlapsAnyBreak(cursor, slotEnd, breaks)) {
                    cursor = slotEnd;
                    continue;
                }

                boolean exists = slotRepo.existsByVetIdAndSlotDateAndStartTimeAndEndTime(
                        req.getVetId(),
                        date,
                        cursor,
                        slotEnd
                );

                if (!exists) {
                    slotRepo.save(
                            DoctorSlot.builder()
                                    .vetId(req.getVetId())
                                    .slotDate(date)
                                    .startTime(cursor)
                                    .endTime(slotEnd)
                                    .isAvailable(true)
                                    .build()
                    );
                }

                cursor = slotEnd;
            }
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<SlotResponse> getAvailableSlots(Long vetId, LocalDate date) {
        return slotRepo
                .findByVetIdAndSlotDateAndIsAvailableTrueOrderByStartTime(vetId, date)
                .stream()
                .map(s -> SlotResponse.builder()
                        .slotId(s.getSlotId())
                        .vetId(s.getVetId())
                        .slotDate(s.getSlotDate())
                        .startTime(s.getStartTime())
                        .endTime(s.getEndTime())
                        .isAvailable(s.isAvailable())
                        .build())
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SlotResponse getSlot(Long slotId) {
        DoctorSlot slot = slotRepo.findById(slotId)
                .orElseThrow(() -> new NotFoundException("Slot not found: " + slotId));

        return SlotResponse.builder()
                .slotId(slot.getSlotId())
                .vetId(slot.getVetId())
                .slotDate(slot.getSlotDate())
                .startTime(slot.getStartTime())
                .endTime(slot.getEndTime())
                .isAvailable(slot.isAvailable())
                .build();
    }

    private boolean overlapsAnyBreak(LocalTime start, LocalTime end, List<VetBreak> breaks) {
        for (VetBreak br : breaks) {
            // overlap check: start < br.end && end > br.start
            if (start.isBefore(br.getEndTime()) && end.isAfter(br.getStartTime())) {
                return true;
            }
        }
        return false;
    }

    private String toDayCode(DayOfWeek day) {
        return switch (day) {
            case MONDAY -> "MON";
            case TUESDAY -> "TUE";
            case WEDNESDAY -> "WED";
            case THURSDAY -> "THU";
            case FRIDAY -> "FRI";
            case SATURDAY -> "SAT";
            case SUNDAY -> "SUN";
        };
    }

    // TODO: wire this to your actual vet_leaves table once you paste that schema
    private boolean isVetOnLeave(Long vetId, LocalDate date) {
        return false;
    }
}
