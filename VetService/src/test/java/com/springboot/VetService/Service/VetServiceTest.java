package com.springboot.VetService.Service;

import com.springboot.VetService.Entity.*;
import com.springboot.VetService.Exceptions.VetServiceException;
import com.springboot.VetService.Repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.web.client.RestTemplate;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class VetServiceTest {

    @Mock
    private VetRepository vetRepository;

    @Mock
    private VetWorkingHourRepository vetWorkingHourRepository;

    @Mock
    private VetBreakRepository vetBreakRepository;

    @Mock
    private AppointmentTypeRepository appointmentTypeRepository;

    @Mock
    private DoctorAppointmentTypeRepository doctorAppointmentTypeRepository;

    @Mock
    private VetLeaveRepository vetLeaveRepository;

    @Mock
    private AuthUserRepository authUserRepository;

    @Mock
    private ApplicationEventPublisher eventPublisher;

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private VetService vetService;

    private Vet vet;

    @BeforeEach
    void setUp() {
        vet = new Vet();
        vet.setVetId(1L);
        vet.setUserId(100L);
    }

    @Test
    void testCreateVetSuccess() {

        when(vetRepository.findByUserId(100L))
                .thenReturn(Optional.empty());

        when(vetRepository.save(any(Vet.class)))
                .thenReturn(vet);

        Vet savedVet = vetService.createVet(100L);

        assertNotNull(savedVet);
        assertEquals(100L, savedVet.getUserId());

        verify(vetRepository, times(1))
                .save(any(Vet.class));
    }

    @Test
    void testCreateVetAlreadyExists() {

        when(vetRepository.findByUserId(100L))
                .thenReturn(Optional.of(vet));

        assertThrows(
                VetServiceException.class,
                () -> vetService.createVet(100L)
        );

        verify(vetRepository, never())
                .save(any(Vet.class));
    }

    @Test
    void testGetVetByIdSuccess() {

        when(vetRepository.findById(1L))
                .thenReturn(Optional.of(vet));

        Vet result = vetService.getVetById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getVetId());
    }

    @Test
    void testGetVetByIdNotFound() {

        when(vetRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                VetServiceException.class,
                () -> vetService.getVetById(1L)
        );
    }
    @Test
    void testCreateAppointmentTypeSuccess() {

        AppointmentType appointmentType = new AppointmentType();
        appointmentType.setName("Surgery");

        when(appointmentTypeRepository.findByNameIgnoreCase("Surgery"))
                .thenReturn(Optional.empty());

        when(appointmentTypeRepository.save(any(AppointmentType.class)))
                .thenReturn(appointmentType);

        AppointmentType result =
                vetService.createAppointmentType(appointmentType);

        assertNotNull(result);
        assertEquals("Surgery", result.getName());

        verify(appointmentTypeRepository, times(1))
                .save(any(AppointmentType.class));
    }

    @Test
    void testCreateAppointmentTypeAlreadyExists() {

        AppointmentType appointmentType = new AppointmentType();
        appointmentType.setName("Surgery");

        when(appointmentTypeRepository.findByNameIgnoreCase("Surgery"))
                .thenReturn(Optional.of(appointmentType));

        assertThrows(
                VetServiceException.class,
                () -> vetService.createAppointmentType(appointmentType)
        );

        verify(appointmentTypeRepository, never())
                .save(any(AppointmentType.class));
    }
    @Test
    void testAddWorkingHourSuccess() {

        VetWorkingHour workingHour = new VetWorkingHour();

        workingHour.setDayOfWeek(String.valueOf(java.time.DayOfWeek.MONDAY));
        workingHour.setStartTime(java.time.LocalTime.of(9, 0));
        workingHour.setEndTime(java.time.LocalTime.of(17, 0));

        when(vetRepository.findById(1L))
                .thenReturn(Optional.of(vet));

        when(vetWorkingHourRepository
                .existsByVet_VetIdAndDayOfWeek(
                        1L,
                        String.valueOf(java.time.DayOfWeek.MONDAY)))
                .thenReturn(false);

        when(vetWorkingHourRepository.save(any(VetWorkingHour.class)))
                .thenReturn(workingHour);

        VetWorkingHour result =
                vetService.addWorkingHour(1L, workingHour);

        assertNotNull(result);

        verify(vetWorkingHourRepository, times(1))
                .save(any(VetWorkingHour.class));

        verify(eventPublisher, times(1))
                .publishEvent(any(com.springboot.VetService.events.VetWorkingHoursSavedEvent.class));
    }

    @Test
    void testAddWorkingHourInvalidTimeRange() {

        VetWorkingHour workingHour = new VetWorkingHour();

        workingHour.setStartTime(java.time.LocalTime.of(17, 0));
        workingHour.setEndTime(java.time.LocalTime.of(9, 0));

        when(vetRepository.findById(1L))
                .thenReturn(Optional.of(vet));

        assertThrows(
                VetServiceException.class,
                () -> vetService.addWorkingHour(1L, workingHour)
        );

        verify(vetWorkingHourRepository, never())
                .save(any(VetWorkingHour.class));
    }

    @Test
    void testAddWorkingHourAlreadyExists() {

        VetWorkingHour workingHour = new VetWorkingHour();

        workingHour.setDayOfWeek(String.valueOf(java.time.DayOfWeek.MONDAY));
        workingHour.setStartTime(java.time.LocalTime.of(9, 0));
        workingHour.setEndTime(java.time.LocalTime.of(17, 0));

        when(vetRepository.findById(1L))
                .thenReturn(Optional.of(vet));

        when(vetWorkingHourRepository
                .existsByVet_VetIdAndDayOfWeek(
                        1L,
                        String.valueOf(java.time.DayOfWeek.MONDAY)))
                .thenReturn(true);

        assertThrows(
                VetServiceException.class,
                () -> vetService.addWorkingHour(1L, workingHour)
        );

        verify(vetWorkingHourRepository, never())
                .save(any(VetWorkingHour.class));
    }
    @Test
    void testApplyLeaveSuccess() {

        VetLeave leave = new VetLeave();

        leave.setFromDate(java.time.LocalDate.now());
        leave.setToDate(java.time.LocalDate.now().plusDays(2));

        when(vetRepository.findById(1L))
                .thenReturn(Optional.of(vet));

        when(vetLeaveRepository
                .existsByVet_VetIdAndFromDateAndToDate(
                        anyLong(),
                        any(),
                        any()))
                .thenReturn(false);

        when(vetLeaveRepository.save(any(VetLeave.class)))
                .thenReturn(leave);

        VetLeave result = vetService.applyLeave(1L, leave);

        assertNotNull(result);

        verify(vetLeaveRepository, times(1))
                .save(any(VetLeave.class));
    }

    @Test
    void testApplyLeaveNullDates() {

        VetLeave leave = new VetLeave();

        when(vetRepository.findById(1L))
                .thenReturn(Optional.of(vet));

        assertThrows(
                VetServiceException.class,
                () -> vetService.applyLeave(1L, leave)
        );
    }

    @Test
    void testApplyLeaveInvalidDateRange() {

        VetLeave leave = new VetLeave();

        leave.setFromDate(java.time.LocalDate.now().plusDays(5));
        leave.setToDate(java.time.LocalDate.now());

        when(vetRepository.findById(1L))
                .thenReturn(Optional.of(vet));

        assertThrows(
                VetServiceException.class,
                () -> vetService.applyLeave(1L, leave)
        );
    }

    @Test
    void testApplyLeaveAlreadyExists() {

        VetLeave leave = new VetLeave();

        leave.setFromDate(java.time.LocalDate.now());
        leave.setToDate(java.time.LocalDate.now().plusDays(2));

        when(vetRepository.findById(1L))
                .thenReturn(Optional.of(vet));

        when(vetLeaveRepository
                .existsByVet_VetIdAndFromDateAndToDate(
                        anyLong(),
                        any(),
                        any()))
                .thenReturn(true);

        assertThrows(
                VetServiceException.class,
                () -> vetService.applyLeave(1L, leave)
        );
    }
    @Test
    void testAddBreakSuccess() {

        VetBreak vetBreak = new VetBreak();

        vetBreak.setStartTime(java.time.LocalTime.of(12, 0));
        vetBreak.setEndTime(java.time.LocalTime.of(13, 0));

        when(vetRepository.findById(1L))
                .thenReturn(Optional.of(vet));

        when(vetBreakRepository
                .existsByVet_VetIdAndStartTimeAndEndTime(
                        anyLong(),
                        any(),
                        any()))
                .thenReturn(false);

        when(vetBreakRepository.save(any(VetBreak.class)))
                .thenReturn(vetBreak);

        VetBreak result = vetService.addBreak(1L, vetBreak);

        assertNotNull(result);

        verify(vetBreakRepository, times(1))
                .save(any(VetBreak.class));
    }

    @Test
    void testAddBreakInvalidTimeRange() {

        VetBreak vetBreak = new VetBreak();

        vetBreak.setStartTime(java.time.LocalTime.of(14, 0));
        vetBreak.setEndTime(java.time.LocalTime.of(12, 0));

        when(vetRepository.findById(1L))
                .thenReturn(Optional.of(vet));

        assertThrows(
                VetServiceException.class,
                () -> vetService.addBreak(1L, vetBreak)
        );
    }

    @Test
    void testAddBreakAlreadyExists() {

        VetBreak vetBreak = new VetBreak();

        vetBreak.setStartTime(java.time.LocalTime.of(12, 0));
        vetBreak.setEndTime(java.time.LocalTime.of(13, 0));

        when(vetRepository.findById(1L))
                .thenReturn(Optional.of(vet));

        when(vetBreakRepository
                .existsByVet_VetIdAndStartTimeAndEndTime(
                        anyLong(),
                        any(),
                        any()))
                .thenReturn(true);

        assertThrows(
                VetServiceException.class,
                () -> vetService.addBreak(1L, vetBreak)
        );
    }
    @Test
    void testGetVetsBySpeciality() {

        AppointmentType appointmentType = new AppointmentType();
        appointmentType.setName("Surgery");

        DoctorAppointmentType mapping = new DoctorAppointmentType();
        mapping.setVet(vet);
        mapping.setAppointmentType(appointmentType);

        when(doctorAppointmentTypeRepository.findAll())
                .thenReturn(java.util.List.of(mapping));

        var result = vetService.getVetsBySpeciality("Surgery");

        assertEquals(1, result.size());
    }

    @Test
    void testGetAppointmentTypesForVet() {

        AppointmentType appointmentType = new AppointmentType();
        appointmentType.setName("Dental");

        DoctorAppointmentType mapping = new DoctorAppointmentType();
        mapping.setAppointmentType(appointmentType);

        when(vetRepository.findById(1L))
                .thenReturn(Optional.of(vet));

        when(doctorAppointmentTypeRepository.findByVet_VetId(1L))
                .thenReturn(java.util.List.of(mapping));

        var result = vetService.getAppointmentTypesForVet(1L);

        assertEquals(1, result.size());
    }

    @Test
    void testGetVetSummariesBySpeciality() {

        AppointmentType appointmentType = new AppointmentType();
        appointmentType.setName("Surgery");

        DoctorAppointmentType mapping = new DoctorAppointmentType();
        mapping.setVet(vet);
        mapping.setAppointmentType(appointmentType);

        AuthUser user = new AuthUser();
        user.setUserId(100L);
        user.setName("Dr John");
        user.setEmail("john@test.com");

        when(doctorAppointmentTypeRepository.findAll())
                .thenReturn(java.util.List.of(mapping));

        when(authUserRepository.findAllById(any()))
                .thenReturn(java.util.List.of(user));

        var result =
                vetService.getVetSummariesBySpeciality("Surgery");

        assertEquals(1, result.size());
        assertEquals("Dr John", result.get(0).getName());
    }

    @Test
    void testGetAllVetSummaries() {

        AuthUser user = new AuthUser();

        user.setUserId(100L);
        user.setName("Dr Smith");
        user.setEmail("smith@test.com");

        when(vetRepository.findAll())
                .thenReturn(java.util.List.of(vet));

        when(authUserRepository.findAllById(any()))
                .thenReturn(java.util.List.of(user));

        var result = vetService.getAllVetSummaries();

        assertEquals(1, result.size());
        assertEquals("Dr Smith", result.get(0).getName());
    }

    @Test
    void testGenerateSlotsForNext4Weeks() {

        when(restTemplate.postForEntity(
                anyString(),
                any(),
                eq(Void.class)))
                .thenReturn(null);

        assertDoesNotThrow(
                () -> vetService.generateSlotsForNext4Weeks(1L)
        );

        verify(restTemplate, times(1))
                .postForEntity(
                        anyString(),
                        any(),
                        eq(Void.class));
    }
    @Test
    void testGenerateSlotsForNext4WeeksException() {

        when(restTemplate.postForEntity(
                anyString(),
                any(),
                eq(Void.class)))
                .thenThrow(new RuntimeException("API Failure"));

        assertDoesNotThrow(
                () -> vetService.generateSlotsForNext4Weeks(1L)
        );
    }

    @Test
    void testGetVetSummariesBySpecialityNullUser() {

        AppointmentType appointmentType = new AppointmentType();
        appointmentType.setName("Dental");

        DoctorAppointmentType mapping = new DoctorAppointmentType();
        mapping.setVet(vet);
        mapping.setAppointmentType(appointmentType);

        when(doctorAppointmentTypeRepository.findAll())
                .thenReturn(java.util.List.of(mapping));

        when(authUserRepository.findAllById(any()))
                .thenReturn(java.util.List.of());

        var result =
                vetService.getVetSummariesBySpeciality("Dental");

        assertEquals(1, result.size());
        assertEquals("Vet 1", result.get(0).getName());
    }

    @Test
    void testGetAllVetSummariesNullUser() {

        when(vetRepository.findAll())
                .thenReturn(java.util.List.of(vet));

        when(authUserRepository.findAllById(any()))
                .thenReturn(java.util.List.of());

        var result = vetService.getAllVetSummaries();

        assertEquals(1, result.size());
        assertEquals("Vet 1", result.get(0).getName());
    }

    @Test
    void testCreateVetWithAppointmentTypesDuplicateSkipped() {

        when(vetRepository.findByUserId(100L))
                .thenReturn(Optional.of(vet));

        when(doctorAppointmentTypeRepository
                .existsByVet_VetIdAndAppointmentType_AppointmentTypeId(
                        anyLong(),
                        anyLong()))
                .thenReturn(true);

        Vet result =
                vetService.createVetWithAppointmentTypes(
                        100L,
                        java.util.List.of(1L));

        assertNotNull(result);

        verify(doctorAppointmentTypeRepository, never())
                .save(any());
    }

    @Test
    void testCreateVetWithAppointmentTypesNoAppointmentTypes() {

        when(vetRepository.findByUserId(100L))
                .thenReturn(Optional.of(vet));

        Vet result =
                vetService.createVetWithAppointmentTypes(
                        100L,
                        java.util.List.of());

        assertNotNull(result);
    }

    @Test
    void testGetVetsBySpecialityNoMatch() {

        AppointmentType appointmentType = new AppointmentType();
        appointmentType.setName("Dental");

        DoctorAppointmentType mapping = new DoctorAppointmentType();
        mapping.setVet(vet);
        mapping.setAppointmentType(appointmentType);

        when(doctorAppointmentTypeRepository.findAll())
                .thenReturn(java.util.List.of(mapping));

        var result = vetService.getVetsBySpeciality("Surgery");

        assertEquals(0, result.size());
    }
    @Test

    void testGetVetsBySpecialityEmpty() {

        when(doctorAppointmentTypeRepository.findAll())
                .thenReturn(java.util.List.of());

        var result =
                vetService.getVetsBySpeciality("Unknown");

        assertTrue(result.isEmpty());
    }
//    @Test
//    void testGetAllVetSummaries() {
//
//        when(vetRepository.findAll())
//                .thenReturn(java.util.Collections.emptyList());
//
//        var result =
//                vetService.getAllVetSummaries();
//
//        assertTrue(result.isEmpty());
//    }

    @Test
    void testCreateVetWithAppointmentTypesNullUserId() {

        assertThrows(
                VetServiceException.class,
                () -> vetService.createVetWithAppointmentTypes(
                        null,
                        java.util.Collections.emptyList()
                )
        );
    }

    @Test
    void testCreateVetWithAppointmentTypesExistingVet() {

        Vet vet = new Vet();
        vet.setVetId(1L);
        vet.setUserId(100L);

        when(vetRepository.findByUserId(100L))
                .thenReturn(java.util.Optional.of(vet));

        vetService.createVetWithAppointmentTypes(
                100L,
                java.util.Collections.emptyList()
        );

        verify(vetRepository, never()).save(any());
    }

    @Test
    void testAssignAppointmentTypesDuplicate() {

        Vet vet = new Vet();
        vet.setVetId(1L);

        when(vetRepository.findById(1L))
                .thenReturn(java.util.Optional.of(vet));

        when(
                doctorAppointmentTypeRepository
                        .existsByVet_VetIdAndAppointmentType_AppointmentTypeId(
                                1L,
                                1L
                        )
        ).thenReturn(true);

        vetService.assignAppointmentTypes(
                1L,
                java.util.List.of(1L)
        );

        verify(doctorAppointmentTypeRepository, never())
                .save(any());
    }
}