package com.petclinic.appointmentService.service;

import com.petclinic.appointmentService.dto.GenerateSlotsRequest;
import com.petclinic.appointmentService.dto.SlotResponse;

import java.time.LocalDate;
import java.util.List;

public interface SlotService {

    void generateSlots(GenerateSlotsRequest request, Long userId, String role);

    List<SlotResponse> getAvailableSlots(Long vetId, LocalDate date);

    SlotResponse getSlot(Long slotId);
}
