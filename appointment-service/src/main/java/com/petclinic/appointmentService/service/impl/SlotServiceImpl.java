package com.petclinic.appointmentService.service.impl;

import com.petclinic.appointmentService.dto.GenerateSlotsRequest;
import com.petclinic.appointmentService.dto.SlotResponse;
import com.petclinic.appointmentService.entity.DoctorSlot;
import com.petclinic.appointmentService.exception.BadRequestException;
import com.petclinic.appointmentService.exception.ForbiddenException;
import com.petclinic.appointmentService.exception.NotFoundException;
import com.petclinic.appointmentService.repository.DoctorSlotRepository;
import com.petclinic.appointmentService.service.SlotService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SlotServiceImpl implements SlotService {

    private final DoctorSlotRepository slotRepo;

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

        if (req.getDayStartTime().isAfter(req.getDayEndTime())) {
            throw new BadRequestException("dayStartTime must be before dayEndTime");
        }



        for (int i = 0; i < req.getDays(); i++) {
            LocalDate date = req.getStartDate().plusDays(i);

            LocalTime start = req.getDayStartTime();
            while (!start.plusMinutes(req.getSlotMinutes()).isAfter(req.getDayEndTime())) {

                LocalTime end = start.plusMinutes(req.getSlotMinutes());

                boolean exists =
                        slotRepo.existsByVetIdAndSlotDateAndStartTimeAndEndTime(
                                req.getVetId(), date, start, end);

                if (!exists) {
                    slotRepo.save(
                            DoctorSlot.builder()
                                    .vetId(req.getVetId())
                                    .slotDate(date)
                                    .startTime(start)
                                    .endTime(end)
                                    .isAvailable(true)
                                    .build()
                    );
                }

                start = end;
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
                        .isAvailable(s.getIsAvailable())
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
                .isAvailable(slot.getIsAvailable())
                .build();
    }
}
