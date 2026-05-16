package com.springboot.VetService.Controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.springboot.VetService.Entity.*;
import com.springboot.VetService.Service.VetDetailsService;
import com.springboot.VetService.Service.VetService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VetController.class)
class VetControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private VetService vetService;

    @MockitoBean
    private VetDetailsService vetDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetVetById() throws Exception {

        Vet vet = new Vet();
        vet.setVetId(1L);

        when(vetService.getVetById(1L))
                .thenReturn(vet);

        mockMvc.perform(get("/vets/1"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetVetsBySpeciality() throws Exception {

        Vet vet = new Vet();
        vet.setVetId(1L);

        when(vetService.getVetsBySpeciality("Surgery"))
                .thenReturn(List.of(vet));

        mockMvc.perform(get("/vets")
                        .param("speciality", "Surgery"))
                .andExpect(status().isOk());
    }

    @Test
    void testCreateAppointmentType() throws Exception {

        AppointmentType type = new AppointmentType();
        type.setName("Dental");

        when(vetService.createAppointmentType(org.mockito.ArgumentMatchers.any()))
                .thenReturn(type);

        mockMvc.perform(post("/vets/appointment-types")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(type)))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAllAppointmentTypes() throws Exception {

        AppointmentType type = new AppointmentType();
        type.setName("Dental");

        when(vetService.getAllAppointmentTypes())
                .thenReturn(List.of(type));

        mockMvc.perform(get("/vets/appointment-types"))
                .andExpect(status().isOk());
    }

    @Test
    void testAddWorkingHour() throws Exception {

        VetWorkingHour workingHour = new VetWorkingHour();

        when(vetService.addWorkingHour(
                org.mockito.ArgumentMatchers.eq(1L),
                org.mockito.ArgumentMatchers.any()))
                .thenReturn(workingHour);

        mockMvc.perform(post("/vets/1/working-hours")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(workingHour)))
                .andExpect(status().isOk());
    }

    @Test
    void testGetWorkingHours() throws Exception {

        VetWorkingHour workingHour = new VetWorkingHour();

        when(vetService.getWorkingHours(1L))
                .thenReturn(List.of(workingHour));

        mockMvc.perform(get("/vets/1/working-hours"))
                .andExpect(status().isOk());
    }

    @Test
    void testAddBreak() throws Exception {

        VetBreak vetBreak = new VetBreak();

        when(vetService.addBreak(
                org.mockito.ArgumentMatchers.eq(1L),
                org.mockito.ArgumentMatchers.any()))
                .thenReturn(vetBreak);

        mockMvc.perform(post("/vets/1/breaks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(vetBreak)))
                .andExpect(status().isOk());
    }

    @Test
    void testGetBreaks() throws Exception {

        VetBreak vetBreak = new VetBreak();

        when(vetService.getBreaks(1L))
                .thenReturn(List.of(vetBreak));

        mockMvc.perform(get("/vets/1/breaks"))
                .andExpect(status().isOk());
    }

    @Test
    void testApplyLeave() throws Exception {

        VetLeave leave = new VetLeave();

        when(vetService.applyLeave(
                org.mockito.ArgumentMatchers.eq(1L),
                org.mockito.ArgumentMatchers.any()))
                .thenReturn(leave);

        mockMvc.perform(post("/vets/1/leave")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(leave)))
                .andExpect(status().isOk());
    }

    @Test
    void testGetVetHolidays() throws Exception {

        VetLeave leave = new VetLeave();

        when(vetService.getHolidaysForVet(1L))
                .thenReturn(List.of(leave));

        mockMvc.perform(get("/vets/1/holidays"))
                .andExpect(status().isOk());
    }
//    @Test
//    void testGetWorkingHoursEmpty() throws Exception {
//
//        when(vetService.getWorkingHours(1L))
//                .thenReturn(java.util.List.of());
//
//        mockMvc.perform(get("/vets/1/working-hours"))
//                .andExpect(status().isOk());
//    }

    @Test
    void testGetHolidaysEmpty() throws Exception {

        when(vetService.getHolidaysForVet(1L))
                .thenReturn(java.util.List.of());

        mockMvc.perform(get("/vets/1/holidays"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetBreaksEmpty() throws Exception {

        when(vetService.getBreaks(1L))
                .thenReturn(java.util.List.of());

        mockMvc.perform(get("/vets/1/breaks"))
                .andExpect(status().isOk());
    }
    @Test
    void testGetWorkingHoursEmpty() throws Exception {

        when(vetService.getWorkingHours(1L))
                .thenReturn(java.util.List.of());

        mockMvc.perform(get("/vets/1/working-hours"))
                .andExpect(status().isOk());
    }

//    @Test
//    void testGetBreaksEmpty() throws Exception {
//
//        when(vetService.getBreaks(1L))
//                .thenReturn(java.util.List.of());
//
//        mockMvc.perform(get("/vets/1/breaks"))
//                .andExpect(status().isOk());
//    }

    @Test
    void testGetVetHolidaysEmpty() throws Exception {

        when(vetService.getHolidaysForVet(1L))
                .thenReturn(java.util.List.of());

        mockMvc.perform(get("/vets/1/holidays"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAppointmentTypesEmpty() throws Exception {

        when(vetService.getAllAppointmentTypes())
                .thenReturn(java.util.List.of());

        mockMvc.perform(get("/vets/appointment-types"))
                .andExpect(status().isOk());
    }
    @Test
    void testGetVetByIdException() {

        when(vetService.getVetById(1L))
                .thenThrow(new RuntimeException("Vet not found"));

        assertThrows(
                jakarta.servlet.ServletException.class,
                () -> mockMvc.perform(get("/vets/1"))
        );
    }

    @Test
    void testGetWorkingHoursException() {

        when(vetService.getWorkingHours(1L))
                .thenThrow(new RuntimeException("Error"));

        assertThrows(
                jakarta.servlet.ServletException.class,
                () -> mockMvc.perform(get("/vets/1/working-hours"))
        );
    }

    @Test
    void testGetBreaksException() {

        when(vetService.getBreaks(1L))
                .thenThrow(new RuntimeException("Error"));

        assertThrows(
                jakarta.servlet.ServletException.class,
                () -> mockMvc.perform(get("/vets/1/breaks"))
        );
    }

    @Test
    void testGetAppointmentTypesException() {

        when(vetService.getAllAppointmentTypes())
                .thenThrow(new RuntimeException("Error"));

        assertThrows(
                jakarta.servlet.ServletException.class,
                () -> mockMvc.perform(get("/vets/appointment-types"))
        );
    }
    @Test
    void testGetAllVetSummaries() throws Exception {

        when(vetService.getAllVetSummaries())
                .thenReturn(java.util.Collections.emptyList());

        mockMvc.perform(get("/vets/summaries"))
                .andExpect(status().isOk());
    }

    @Test
    void testGetAppointmentTypesForVet() throws Exception {

        when(vetService.getAppointmentTypesForVet(1L))
                .thenReturn(java.util.Collections.emptyList());

        mockMvc.perform(get("/vets/1/appointment-types"))
                .andExpect(status().isOk());
    }

    @Test
    void testAssignAppointmentTypesToVet() throws Exception {

        mockMvc.perform(post("/vets/1/appointment-types")
                        .contentType(
                                org.springframework.http.MediaType.APPLICATION_JSON
                        )
                        .content("[1,2]"))
                .andExpect(status().isOk());
    }
}