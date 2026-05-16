package com.springboot.VetService.listner;

import com.springboot.VetService.Service.VetService;
import com.springboot.VetService.events.VetWorkingHoursSavedEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionalEventListener;
import org.springframework.transaction.event.TransactionPhase;

@Component
public class SlotGenerationListener {

    private final VetService vetService;

    public SlotGenerationListener(VetService vetService) {
        this.vetService = vetService;
    }

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void handleWorkingHoursSaved(VetWorkingHoursSavedEvent event) {

        Long vetId = event.vetId();

        // data is committed
        vetService.generateSlotsForNext4Weeks(vetId);
    }
}