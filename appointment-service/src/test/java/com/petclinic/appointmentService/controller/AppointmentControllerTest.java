
package com.petclinic.appointmentService.controller;

import com.petclinic.appointmentService.security.GatewayAuth;
import com.petclinic.appointmentService.entity.AppointmentStatus;
import com.petclinic.appointmentService.service.AppointmentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


@WebMvcTest(controllers = AppointmentController.class)
class AppointmentControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private AppointmentService appointmentService;


    private static String hdrUser() { return GatewayAuth.HDR_USER_ID; }
    private static String hdrRole() { return GatewayAuth.HDR_ROLE; }

    private static final String OWNER = "OWNER";
    private static final String VET   = "VET";
    private static final String ADMIN = "ADMIN";

    private static final String BOOK_JSON = """
        {
          "petId": 5,
          "vetId": 21,
          "slotId": 99,
          "appointmentTypeId": 1,
          "appointmentMode": "OFFLINE"
        }
        """;

    private static final String UPDATE_STATUS_JSON = """
        { "status": "COMPLETED" }
        """;


    @Test
    void book_shouldReturn200_andCallService_whenOwnerHeadersValid() throws Exception {
        when(appointmentService.book(anyLong(), anyString(), any())).thenReturn(null);

        mvc.perform(post("/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "10")
                        .header(hdrRole(), OWNER)
                        .content(BOOK_JSON))
                .andExpect(status().isOk());

        verify(appointmentService).book(eq(10L), eq(OWNER), any());
    }

    @Test
    void book_shouldReturn4xx_andNotCallService_whenRoleNotOwner() throws Exception {
        mvc.perform(post("/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "10")
                        .header(hdrRole(), VET)
                        .content(BOOK_JSON))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(appointmentService);
    }

    @Test
    void book_shouldReturn400_whenMissingHeaders() throws Exception {
        mvc.perform(post("/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .content(BOOK_JSON))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(appointmentService);
    }

    @Test
    void book_shouldReturn400_whenInvalidBody() throws Exception {
        // empty JSON -> should fail @Valid (based on your DTO constraints)
        mvc.perform(post("/appointments")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "10")
                        .header(hdrRole(), OWNER)
                        .content("{}"))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(appointmentService);
    }

    @Test
    void get_shouldReturn200_andCallService_forOwner() throws Exception {
        when(appointmentService.getById(anyLong(), anyLong(), anyString())).thenReturn(null);

        mvc.perform(get("/appointments/1")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "10")
                        .header(hdrRole(), OWNER))
                .andExpect(status().isOk());

        verify(appointmentService).getById(1L,10L, OWNER);
    }

    @Test
    void get_shouldReturn200_andCallService_forVet() throws Exception {
        when(appointmentService.getById(anyLong(), anyLong(), anyString())).thenReturn(null);

        mvc.perform(get("/appointments/1")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "21")
                        .header(hdrRole(), VET))
                .andExpect(status().isOk());

        verify(appointmentService).getById(1L,21L, VET);
    }

    @Test
    void get_shouldReturn200_andCallService_forAdmin() throws Exception {
        when(appointmentService.getById(anyLong(), anyLong(), anyString())).thenReturn(null);

        mvc.perform(get("/appointments/1")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "999")
                        .header(hdrRole(), ADMIN))
                .andExpect(status().isOk());

        verify(appointmentService).getById(1L,999L,ADMIN);
    }

    @Test
    void get_shouldReturn4xx_andNotCallService_whenRoleNotAllowed() throws Exception {
        mvc.perform(get("/appointments/1")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "10")
                        .header(hdrRole(), "GUEST"))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(appointmentService);
    }


    @Test
    void my_shouldReturn200_andEmptyList_forOwner() throws Exception {
        when(appointmentService.myAppointments(10L, OWNER)).thenReturn(List.of());

        mvc.perform(get("/appointments/my")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "10")
                        .header(hdrRole(), OWNER))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        verify(appointmentService).myAppointments(10L,OWNER);
    }

    @Test
    void my_shouldReturn200_andEmptyList_forVet() throws Exception {
        when(appointmentService.myAppointments(21L, VET)).thenReturn(List.of());

        mvc.perform(get("/appointments/my")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "21")
                        .header(hdrRole(), VET))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        verify(appointmentService).myAppointments(21L,VET);
    }

    @Test
    void my_shouldReturn4xx_andNotCallService_whenRoleNotAllowed() throws Exception {
        mvc.perform(get("/appointments/my")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "10")
                        .header(hdrRole(), ADMIN))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(appointmentService);
    }

    @Test
    void doctor_shouldReturn200_andEmptyList_forVet() throws Exception {
        when(appointmentService.doctorAppointments(21L, 21L, VET)).thenReturn(List.of());

        mvc.perform(get("/appointments/doctor/21")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "21")
                        .header(hdrRole(), VET))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        verify(appointmentService).doctorAppointments(21L,21L, VET);
    }

    @Test
    void doctor_shouldReturn200_andEmptyList_forAdmin() throws Exception {
        when(appointmentService.doctorAppointments(21L, 999L, ADMIN)).thenReturn(List.of());

        mvc.perform(get("/appointments/doctor/21")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "999")
                        .header(hdrRole(), ADMIN))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        verify(appointmentService).doctorAppointments(21L,999L,ADMIN);
    }

    @Test
    void doctor_shouldReturn4xx_andNotCallService_whenRoleNotAllowed() throws Exception {
        mvc.perform(get("/appointments/doctor/21")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "10")
                        .header(hdrRole(), OWNER))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(appointmentService);
    }

    @Test
    void cancel_shouldReturn200_andCallService_forOwner() throws Exception {
        when(appointmentService.cancel(anyLong(), anyLong(), anyString())).thenReturn(null);

        mvc.perform(post("/appointments/1/cancel")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "10")
                        .header(hdrRole(), OWNER))
                .andExpect(status().isOk());

        verify(appointmentService).cancel(1L,10L,OWNER);
    }

    @Test
    void cancel_shouldReturn200_andCallService_forAdmin() throws Exception {
        when(appointmentService.cancel(anyLong(), anyLong(), anyString())).thenReturn(null);

        mvc.perform(post("/appointments/1/cancel")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "999")
                        .header(hdrRole(), ADMIN))
                .andExpect(status().isOk());

        verify(appointmentService).cancel(1L,999L,ADMIN);
    }

    @Test
    void cancel_shouldReturn4xx_andNotCallService_whenRoleNotAllowed() throws Exception {
        mvc.perform(post("/appointments/1/cancel")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "21")
                        .header(hdrRole(), VET))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(appointmentService);
    }


    @Test
    void updateStatus_shouldReturn200_andCallService_forVet() throws Exception {
        when(appointmentService.updateStatus(anyLong(), any(), anyLong(), anyString())).thenReturn(null);

        mvc.perform(patch("/appointments/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "21")
                        .header(hdrRole(), VET)
                        .content(UPDATE_STATUS_JSON))
                .andExpect(status().isOk());

        verify(appointmentService).updateStatus(1L, AppointmentStatus.COMPLETED, 21L, VET);
    }

    @Test
    void updateStatus_shouldReturn200_andCallService_forAdmin() throws Exception {
        when(appointmentService.updateStatus(anyLong(), any(), anyLong(), anyString())).thenReturn(null);

        mvc.perform(patch("/appointments/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "999")
                        .header(hdrRole(), ADMIN)
                        .content(UPDATE_STATUS_JSON))
                .andExpect(status().isOk());

        verify(appointmentService).updateStatus(1L, AppointmentStatus.COMPLETED, 999L, ADMIN);
    }

    @Test
    void updateStatus_shouldReturn4xx_andNotCallService_whenRoleNotAllowed() throws Exception {
        mvc.perform(patch("/appointments/1/status")
                        .contentType(MediaType.APPLICATION_JSON)
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "10")
                        .header(hdrRole(), OWNER)
                        .content(UPDATE_STATUS_JSON))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(appointmentService);
    }

    @Test
    void adminAll_shouldReturn200_andEmptyList_forAdmin() throws Exception {
        when(appointmentService.adminAllAppointments()).thenReturn(List.of());

        mvc.perform(get("/appointments/admin/appointments")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrRole(), ADMIN))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        verify(appointmentService).adminAllAppointments();
    }

    @Test
    void adminAll_shouldReturn4xx_andNotCallService_whenRoleNotAdmin() throws Exception {
        mvc.perform(get("/appointments/admin/appointments")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrRole(), VET))
                .andExpect(status().is4xxClientError());

        verifyNoInteractions(appointmentService);
    }


    @Test
    void byPet_shouldReturn200_andEmptyList_forOwner() throws Exception {
        when(appointmentService.appointmentsByPet(5L, 10L,OWNER)).thenReturn(List.of());

        mvc.perform(get("/appointments/pet/5")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "10")
                        .header(hdrRole(), OWNER))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        verify(appointmentService).appointmentsByPet(5L,10L,OWNER);
    }

    @Test
    void byPet_shouldReturn200_andEmptyList_forVet() throws Exception {
        when(appointmentService.appointmentsByPet(5L, 21L, VET)).thenReturn(List.of());

        mvc.perform(get("/appointments/pet/5")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "21")
                        .header(hdrRole(), VET))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        verify(appointmentService).appointmentsByPet(5L,21L,VET);
    }

    @Test
    void byPet_shouldReturn200_andEmptyList_forAdmin() throws Exception {
        when(appointmentService.appointmentsByPet(5L, 999L, ADMIN)).thenReturn(List.of());

        mvc.perform(get("/appointments/pet/5")
                        .accept(MediaType.APPLICATION_JSON)
                        .header(hdrUser(), "999")
                        .header(hdrRole(), ADMIN))
                .andExpect(status().isOk())
                .andExpect(content().json("[]"));

        verify(appointmentService).appointmentsByPet(5L,999L,ADMIN);
    }
}