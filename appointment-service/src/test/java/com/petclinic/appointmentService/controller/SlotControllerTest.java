package com.petclinic.appointmentService.controller;

import com.petclinic.appointmentService.security.GatewayAuth;
import com.petclinic.appointmentService.service.SlotService;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(SlotController.class)
class SlotControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private SlotService slotService;

    private static String hdrUser() { return GatewayAuth.HDR_USER_ID; }
    private static String hdrRole() { return GatewayAuth.HDR_ROLE; }

    private static final String OWNER = "OWNER";
    private static final String VET = "VET";
    private static final String ADMIN = "ADMIN";

    private static final String GENERATE_JSON = """
        {
          "vetId": 1,
          "startDate": "2026-05-18",
          "days": 1,
          "slotMinutes": 30
        }
        """;


    @Test
    void generate_shouldReturn200_andCallService_whenVet() throws Exception {

        mvc.perform(post("/slots/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "21")
                        .header(hdrRole(), VET)
                        .content(GENERATE_JSON))
                .andExpect(status().isOk());

        verify(slotService).generateSlots(any(), eq(21L), eq(VET));
    }

    @Test
    void generate_shouldReturn200_whenAdmin() throws Exception {

        mvc.perform(post("/slots/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "999")
                        .header(hdrRole(), ADMIN)
                        .content(GENERATE_JSON))
                .andExpect(status().isOk());

        verify(slotService).generateSlots(any(), eq(999L), eq(ADMIN));
    }

    @Test
    void generate_shouldReturn4xx_whenRoleInvalid() throws Exception {

        mvc.perform(post("/slots/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "10")
                        .header(hdrRole(), OWNER)
                        .content(GENERATE_JSON))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(slotService);
    }

    @Test
    void generate_shouldReturn400_whenMissingHeaders() throws Exception {

        mvc.perform(post("/slots/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(GENERATE_JSON))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(slotService);
    }

    @Test
    void generate_shouldReturn400_whenInvalidBody() throws Exception {

        mvc.perform(post("/slots/generate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "21")
                        .header(hdrRole(), VET)
                        .content("{}"))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(slotService);
    }


    @Test
    void available_shouldReturn200_andList() throws Exception {

        when(slotService.getAvailableSlots(1L, LocalDate.parse("2026-05-18")))
                .thenReturn(List.of());

        mvc.perform(get("/slots")
                        .param("vetId", "1")
                        .param("date", "2026-05-18")
                        .header(hdrRole(), OWNER))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        verify(slotService).getAvailableSlots(1L, LocalDate.parse("2026-05-18"));
    }

    @Test
    void available_shouldReturn4xx_whenRoleInvalid() throws Exception {

        mvc.perform(get("/slots")
                        .param("vetId", "1")
                        .param("date", "2026-05-18")
                        .header(hdrRole(), "GUEST"))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(slotService);
    }


    @Test
    void get_shouldReturn200_whenValidRole() throws Exception {

        when(slotService.getSlot(1L)).thenReturn(null);

        mvc.perform(get("/slots/1")
                        .header(hdrRole(), OWNER))
                .andExpect(status().isOk());

        verify(slotService).getSlot(1L);
    }

    @Test
    void get_shouldReturn4xx_whenRoleInvalid() throws Exception {

        mvc.perform(get("/slots/1")
                        .header(hdrRole(), "GUEST"))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(slotService);
    }
}