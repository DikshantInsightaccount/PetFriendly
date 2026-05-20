package com.springboot.VetService.listner;

import com.springboot.VetService.Service.VetService;
import com.springboot.VetService.events.VetWorkingHoursSavedEvent;
import org.junit.jupiter.api.Test;

import static org.mockito.Mockito.*;

class SlotGenerationListenerTest {

    @Test
    void testHandleWorkingHoursSaved() {

        VetService vetService = mock(VetService.class);

        SlotGenerationListener listener =
                new SlotGenerationListener(vetService);

        listener.handleWorkingHoursSaved(
                new VetWorkingHoursSavedEvent(1L)
        );

        verify(vetService, times(1))
                .generateSlotsForNext4Weeks(1L);
    }
}