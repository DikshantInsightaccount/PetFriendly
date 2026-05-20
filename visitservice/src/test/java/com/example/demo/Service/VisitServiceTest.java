package com.example.demo.Service;

import com.example.demo.entities.Visit;
import com.example.demo.repositories.VisitRepository;
import com.example.demo.Exceptions.VisitFoundException;
import com.example.demo.Exceptions.VisitNotexistExceptions;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class VisitServiceTest {

    @Mock
    private VisitRepository visitRepository;

    @InjectMocks
    private VisitService visitService;

    private Visit visit;

    @BeforeEach
    void setup() {
        MockitoAnnotations.openMocks(this);

        visit = new Visit();
        visit.setAppointmentId(101L);
        visit.setDiagnosis("Flu");
        visit.setTreatment("Medicine");
    }

    @Test
    void testGetAllVisits() {
        when(visitRepository.findAll()).thenReturn(List.of(visit));

        List<Visit> result = visitService.getAllVisits();

        assertEquals(1, result.size());
        verify(visitRepository).findAll();
    }

    @Test
    void testCreateVisitSuccess() {
        when(visitRepository.findByAppointmentId(101L))
                .thenReturn(Optional.empty());
        when(visitRepository.save(any())).thenReturn(visit);

        Visit result = visitService.createVisit(visit);

        assertNotNull(result);
        verify(visitRepository).save(visit);
    }

    @Test
    void testCreateVisit_AlreadyExists() {
        when(visitRepository.findByAppointmentId(101L))
                .thenReturn(Optional.of(visit));

        assertThrows(VisitFoundException.class, () ->
                visitService.createVisit(visit));
    }

    @Test
    void testGetVisitById() {
        when(visitRepository.findById(1L)).thenReturn(Optional.of(visit));

        Visit result = visitService.getVisitById(1L);

        assertNotNull(result);
    }
    @Test
    void testGetVisitById_NotFound() {
        when(visitRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(VisitNotexistExceptions.class, () ->
                visitService.getVisitById(1L));
    }

    @Test
    void testPatchVisit_AllFields() {
        Visit patch = new Visit();
        patch.setDiagnosis("Cold");
        patch.setTreatment("Rest");
        patch.setPrescription("Tablet");
        patch.setNotes("Take care");

        when(visitRepository.findById(1L)).thenReturn(Optional.of(visit));
        when(visitRepository.save(any())).thenReturn(visit);

        Visit result = visitService.patchVisit(1L, patch);

        assertEquals("Cold", result.getDiagnosis());
        assertEquals("Rest", result.getTreatment());
        assertEquals("Tablet", result.getPrescription());
        assertEquals("Take care", result.getNotes());
    }

    @Test
    void testPatchVisit_PartialUpdate() {
        Visit patch = new Visit();
        patch.setDiagnosis("Updated");

        when(visitRepository.findById(1L)).thenReturn(Optional.of(visit));
        when(visitRepository.save(any())).thenReturn(visit);

        Visit result = visitService.patchVisit(1L, patch);

        assertEquals("Updated", result.getDiagnosis());
        assertEquals("Medicine", result.getTreatment());
    }

    @Test
    void testPatchVisit_NoChange() {
        Visit patch = new Visit();

        when(visitRepository.findById(1L)).thenReturn(Optional.of(visit));
        when(visitRepository.save(any())).thenReturn(visit);

        Visit result = visitService.patchVisit(1L, patch);

        assertEquals("Flu", result.getDiagnosis());
    }

    @Test
    void testGetVisitByAppointmentId() {
        when(visitRepository.findByAppointmentId(101L))
                .thenReturn(Optional.of(visit));

        Visit result = visitService.getVisitByAppointmentId(101L);

        assertNotNull(result);
    }

    @Test
    void testGetVisitByAppointmentId_NotFound() {
        when(visitRepository.findByAppointmentId(101L))
                .thenReturn(Optional.empty());

        assertThrows(VisitNotexistExceptions.class, () ->
                visitService.getVisitByAppointmentId(101L));
    }

    @Test
    void testGetVisitByPet() {
        when(visitRepository.findByPetId(10L))
                .thenReturn(List.of(visit));

        List<Visit> result = visitService.getVisitbyPet(10L);

        assertEquals(1, result.size());
    }
}