package com.example.demo.Controller;

import com.example.demo.Service.PetService;
import com.example.demo.entities.Petentity;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;


import java.time.LocalDate;
import java.util.List;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class PetControllerTests {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private PetService petService;

    Petentity samplePet(String name, Long ownerId) {
        Petentity p = new Petentity();
        p.setName(name);
        p.setOwnerId(ownerId);
        p.setBreed("Persian");
        p.setGender("Male");
        p.setDateOfBirth(LocalDate.of(2020, 1, 1));
        return p;
    }

    Throwable rootCause(Throwable t) {
        Throwable cur = t;
        while (cur.getCause() != null && cur.getCause() != cur) {
            cur = cur.getCause();
        }
        return cur;
    }

    @Test
    void testAllPets_AdminSuccess() throws Exception {
        when(petService.getAllpets()).thenReturn(List.of(samplePet("Dog", 100L)));

        mvc.perform(get("/pets")
                        .header("X-Role", "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("Dog")));

        verify(petService, times(1)).getAllpets();
    }

    @Test
    void testAllPets_OwnerForbidden_RuntimeException() {

        Exception exception = assertThrows(Exception.class, () ->
                mvc.perform(get("/pets")
                        .header("X-Role", "OWNER"))
        );

        Throwable root = exception.getCause();

        assertNotNull(root);
        assertTrue(root instanceof RuntimeException);
        assertEquals("Forbidden", root.getMessage());

        verifyNoInteractions(petService);
    }

    @Test
    void testMyPets_OwnerSuccess() throws Exception {
        when(petService.getPetsByOwner(100L)).thenReturn(List.of(samplePet("Dog", 100L)));

        mvc.perform(get("/pets/my")
                        .header("X-User-Id", "100")
                        .header("X-Role", "OWNER"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].ownerId", is(100)));

        verify(petService).getPetsByOwner(100L);
    }

    @Test
    void testMyPets_MissingHeader_BadRequest400() throws Exception {
        mvc.perform(get("/pets/my")
                        .header("X-Role", "OWNER"))
                .andExpect(status().isBadRequest());

        verifyNoInteractions(petService);
    }

    @Test
    void testGetPet_Success() throws Exception {
        when(petService.getPetSecure(1L, 100L, "OWNER"))
                .thenReturn(samplePet("Dog", 100L));

        mvc.perform(get("/pets/1")
                        .header("X-User-Id", "100")
                        .header("X-Role", "OWNER"))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name", is("Dog")));

        verify(petService).getPetSecure(1L, 100L, "OWNER");
    }

    @Test
    void testAddPet_OwnerSuccess_setsOwnerId() throws Exception {
        Petentity saved = samplePet("Tommy", 100L);
        when(petService.addpets(any(Petentity.class))).thenReturn(saved);

        String requestJson = """
                {
                  "name": "Tommy",
                  "breed": "Persian",
                  "gender": "Male",
                  "dateOfBirth": "2020-01-01"
                }
                """;

        mvc.perform(post("/pets")
                        .header("X-User-Id", "100")
                        .header("X-Role", "OWNER")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name", is("Tommy")))
                .andExpect(jsonPath("$.ownerId", is(100)));

        ArgumentCaptor<Petentity> captor = ArgumentCaptor.forClass(Petentity.class);
        verify(petService).addpets(captor.capture());
        assertEquals(100L, captor.getValue().getOwnerId());
        assertEquals("Tommy", captor.getValue().getName());
    }


    @Test
    void testAddPet_AdminForbidden_RuntimeException()  {

        String requestJson = """
            { "name": "Tommy" }
            """;

        Exception exception = assertThrows(Exception.class, () ->
                mvc.perform(post("/pets")
                        .header("X-User-Id", "100")
                        .header("X-Role", "ADMIN")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
        );

        Throwable root = exception.getCause();

        assertNotNull(root);
        assertTrue(root instanceof RuntimeException);
        assertEquals("Forbidden", root.getMessage());

        verifyNoInteractions(petService);
    }
    @Test
    void testUpdatePet_OwnerSuccess() throws Exception {
        when(petService.updatePetSecure(eq(5L), eq(100L), eq("OWNER"), any(Petentity.class)))
                .thenReturn(samplePet("Updated", 100L));

        String requestJson = """
                { "name": "Updated" }
                """;

        mvc.perform(put("/pets/5")
                        .header("X-User-Id", "100")
                        .header("X-Role", "OWNER")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name", is("Updated")));

        verify(petService).updatePetSecure(eq(5L), eq(100L), eq("OWNER"), any(Petentity.class));
    }

    @Test
    void testPatchPet_AdminSuccess() throws Exception {
        when(petService.patchPetSecure(eq(7L), eq(200L), eq("ADMIN"), any(Petentity.class)))
                .thenReturn(samplePet("Dog", 100L));

        String requestJson = """
                { "breed": "Labrador" }
                """;

        mvc.perform(patch("/pets/7")
                        .header("X-User-Id", "200")
                        .header("X-Role", "ADMIN")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(requestJson))
                .andExpect(status().isOk())
                .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON));

        verify(petService).patchPetSecure(eq(7L), eq(200L), eq("ADMIN"), any(Petentity.class));
    }

    @Test
    void testDeletePet_AdminSuccess() throws Exception {
        when(petService.deleteSecure(10L, 200L, "ADMIN"))
                .thenReturn("Pet soft-deleted successfully");

        mvc.perform(delete("/pets/10")
                        .header("X-User-Id", "200")
                        .header("X-Role", "ADMIN"))
                .andExpect(status().isOk())
                .andExpect(content().string("Pet soft-deleted successfully"));

        verify(petService).deleteSecure(10L, 200L, "ADMIN");
    }
}
