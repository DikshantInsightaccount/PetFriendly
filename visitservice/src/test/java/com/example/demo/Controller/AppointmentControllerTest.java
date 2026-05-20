package com.example.demo.Controller;
import com.example.demo.DTO.AppointmentMiniDto;
import com.example.demo.DTO.AppointmentWithPetDto;
import com.example.demo.Service.AppointmentService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AppointmentController.class)
class AppointmentControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private AppointmentService service;

    private AppointmentMiniDto mini() {
        return new AppointmentMiniDto(1L, 10L, 100L, "BOOKED");
    }

    private AppointmentWithPetDto withPet() {
        return new AppointmentWithPetDto(
                1L, 10L, "Tommy", "Dog", "Labrador", 100L, "BOOKED"
        );
    }

    @Test
    void testGetByVet() throws Exception {
        when(service.getByVet(100L)).thenReturn(List.of(mini()));

        mvc.perform(get("/appointment/vet/100"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$[0].petId").value(10));

        verify(service).getByVet(100L);
    }

    @Test
    void testGetByVetWithPet() throws Exception {
        when(service.getByVetWithPet(100L)).thenReturn(List.of(withPet()));

        mvc.perform(get("/appointment/vet/100/with-pet"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].petName").value("Tommy"))
                .andExpect(jsonPath("$[0].petType").value("Dog"))
                .andExpect(jsonPath("$[0].petBreed").value("Labrador"));

        verify(service).getByVetWithPet(100L);
    }

    @Test
    void testGetByVetAndPet() throws Exception {
        when(service.getByVetAndPet(100L, 10L)).thenReturn(List.of(mini()));

        mvc.perform(get("/appointment/vet/100/pet/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].vetId").value(100));

        verify(service).getByVetAndPet(100L, 10L);
    }

    @Test
    void testGetByVetAndPetWithPet() throws Exception {
        when(service.getByVetAndPetWithPet(100L, 10L)).thenReturn(List.of(withPet()));

        mvc.perform(get("/appointment/vet/100/pet/10/with-pet"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].petName").value("Tommy"));

        verify(service).getByVetAndPetWithPet(100L, 10L);
    }
}