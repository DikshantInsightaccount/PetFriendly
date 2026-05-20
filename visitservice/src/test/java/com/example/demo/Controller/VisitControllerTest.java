package com.example.demo.Controller;

import com.example.demo.Service.VisitService;
import com.example.demo.entities.Visit;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(VisitController.class) // ✅ ONLY controller layer
class VisitControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean// ✅ correct annotation for @WebMvcTest
    private VisitService visitService;

    private Visit sampleVisit() {
        Visit v = new Visit();
        v.setAppointmentId(101L);
        v.setDiagnosis("Flu");
        v.setTreatment("Medicine");
        return v;
    }

    @Test
    void testGetAllVisits() throws Exception {
        when(visitService.getAllVisits()).thenReturn(List.of(sampleVisit()));

        mvc.perform(get("/visits"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].diagnosis").value("Flu"));
    }

    @Test
    void testCreateVisit() throws Exception {
        when(visitService.createVisit(any())).thenReturn(sampleVisit());

        String json = """
                {
                  "appointmentId": 101,
                  "diagnosis": "Flu",
                  "treatment": "Medicine"
                }
                """;

        mvc.perform(post("/visits")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.diagnosis").value("Flu"));
    }

    @Test
    void testGetVisitById() throws Exception {
        when(visitService.getVisitById(1L)).thenReturn(sampleVisit());

        mvc.perform(get("/visits/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.diagnosis").value("Flu"));
    }

    @Test
    void testPatchVisit() throws Exception {
        when(visitService.patchVisit(eq(1L), any())).thenReturn(sampleVisit());

        String json = """
                { "diagnosis": "Updated" }
                """;

        mvc.perform(patch("/visits/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(json))
                .andExpect(status().isOk());
    }

    @Test
    void testGetVisitByAppointment() throws Exception {
        when(visitService.getVisitByAppointmentId(101L)).thenReturn(sampleVisit());

        mvc.perform(get("/visits/appointment/101"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.appointmentId").value(101));
    }

    @Test
    void testGetVisitByPet() throws Exception {
        when(visitService.getVisitbyPet(10L)).thenReturn(List.of(sampleVisit()));

        mvc.perform(get("/visits/pet/10"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].appointmentId").value(101));
    }
}