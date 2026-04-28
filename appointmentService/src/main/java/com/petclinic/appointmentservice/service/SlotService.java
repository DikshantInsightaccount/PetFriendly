package com.petclinic.appointmentservice.service;

import com.petclinic.appointmentservice.dto.GenerateSlotsRequest;
import com.petclinic.appointmentservice.dto.SlotResponse;

import java.time.LocalDate;
import java.util.List;

public interface SlotService {

    void generateSlots(GenerateSlotsRequest request, Long userId, String role);

    List<SlotResponse> getAvailableSlots(Long vetId, LocalDate date);

    SlotResponse getSlot(Long slotId);
}
