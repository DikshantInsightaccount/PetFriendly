package com.example.demo.Service;

import com.example.demo.DTO.AppointmentMiniDto;
import com.example.demo.DTO.AppointmentWithPetDto;
import com.example.demo.DTO.AppointmentWithPetView;
import com.example.demo.entities.Appointment;
import com.example.demo.repositories.AppointmentRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AppointmentServiceTest {

    @Mock
    private AppointmentRepository repo;

    @InjectMocks
    private AppointmentService service;

    @Test
    void testGetByVet_mapsToMiniDtoRecord() {
        Appointment a = new Appointment();
        a.setAppointmentId(1L);
        a.setPetId(10L);
        a.setVetId(100L);
        a.setStatus("BOOKED");

        when(repo.findByVetId(100L)).thenReturn(List.of(a));

        List<AppointmentMiniDto> result = service.getByVet(100L);

        assertEquals(1, result.size());
        AppointmentMiniDto dto = result.get(0);
        assertNotNull(dto);

        verify(repo, times(1)).findByVetId(100L);
    }

    @Test
    void testGetByVetAndPet_mapsToMiniDtoRecord() {
        Appointment a = new Appointment();
        a.setAppointmentId(2L);
        a.setPetId(20L);
        a.setVetId(200L);
        a.setStatus("DONE");

        when(repo.findByVetIdAndPetId(200L, 20L)).thenReturn(List.of(a));

        List<AppointmentMiniDto> result = service.getByVetAndPet(200L, 20L);

        assertEquals(1, result.size());

        AppointmentMiniDto dto = result.get(0);
        assertNotNull(dto);

        verify(repo, times(1)).findByVetIdAndPetId(200L, 20L);
    }

    @Test
    void testGetByVetWithPet_mapsToWithPetDto() {
        AppointmentWithPetView view = mock(AppointmentWithPetView.class);
        when(view.getAppointmentId()).thenReturn(3L);
        when(view.getPetId()).thenReturn(30L);
        when(view.getPetName()).thenReturn("Tommy");
        when(view.getPetType()).thenReturn("Dog");
        when(view.getPetBreed()).thenReturn("Labrador");
        when(view.getVetId()).thenReturn(300L);
        when(view.getStatus()).thenReturn("BOOKED");

        when(repo.findByVetIdWithPet(300L)).thenReturn(List.of(view));

        List<AppointmentWithPetDto> result = service.getByVetWithPet(300L);

        assertEquals(1, result.size());

        AppointmentWithPetDto dto = result.get(0);
        assertEquals(3L, dto.getAppointmentId());
        assertEquals(30L, dto.getPetId());
        assertEquals("Tommy", dto.getPetName());
        assertEquals("Dog", dto.getPetType());
        assertEquals("Labrador", dto.getPetBreed());
        assertEquals(300L, dto.getVetId());
        assertEquals("BOOKED", dto.getStatus());

        verify(repo, times(1)).findByVetIdWithPet(300L);
    }

    @Test
    void testGetByVetAndPetWithPet_mapsToWithPetDto() {
        AppointmentWithPetView view = mock(AppointmentWithPetView.class);
        when(view.getAppointmentId()).thenReturn(4L);
        when(view.getPetId()).thenReturn(40L);
        when(view.getPetName()).thenReturn("Kitty");
        when(view.getPetType()).thenReturn("Cat");
        when(view.getPetBreed()).thenReturn("Persian");
        when(view.getVetId()).thenReturn(400L);
        when(view.getStatus()).thenReturn("DONE");

        when(repo.findByVetIdAndPetIdWithPet(400L, 40L)).thenReturn(List.of(view));

        List<AppointmentWithPetDto> result = service.getByVetAndPetWithPet(400L, 40L);

        assertEquals(1, result.size());

        AppointmentWithPetDto dto = result.get(0);
        assertEquals(4L, dto.getAppointmentId());
        assertEquals(40L, dto.getPetId());
        assertEquals("Kitty", dto.getPetName());
        assertEquals("Cat", dto.getPetType());
        assertEquals("Persian", dto.getPetBreed());
        assertEquals(400L, dto.getVetId());
        assertEquals("DONE", dto.getStatus());

        verify(repo, times(1)).findByVetIdAndPetIdWithPet(400L, 40L);
    }
}