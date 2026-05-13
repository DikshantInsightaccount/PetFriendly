package com.springboot.VetService.listner;

import com.springboot.VetService.Service.VetService;
import com.springboot.VetService.events.VetWorkingHoursSavedEvent;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Component
@RequiredArgsConstructor
public class SlotGenerationListener {

    private final VetService vetService;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleWorkingHoursSaved(VetWorkingHoursSavedEvent event) {

        Long vetId = event.vetId();

        // ✅ NOW SAFE — data is committed
        vetService.generateSlotsForNext4Weeks(vetId);
    }
}