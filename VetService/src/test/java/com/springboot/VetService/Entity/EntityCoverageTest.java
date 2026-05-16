package com.springboot.VetService.Entity;

import org.junit.jupiter.api.Test;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;

import static org.junit.jupiter.api.Assertions.*;

class EntityCoverageTest {

    @Test
    void testVetEntity() {

        Vet vet = new Vet();

        vet.setVetId(1L);
        vet.setUserId(100L);

        assertEquals(1L, vet.getVetId());
        assertEquals(100L, vet.getUserId());
    }

    @Test
    void testAppointmentTypeEntity() {

        AppointmentType type = new AppointmentType();

        type.setAppointmentTypeId(1L);
        type.setName("Dental");

        assertEquals(1L, type.getAppointmentTypeId());
        assertEquals("Dental", type.getName());
    }

    @Test
    void testVetBreakEntity() {

        VetBreak vetBreak = new VetBreak();

        vetBreak.setBreakId(1L);
        vetBreak.setStartTime(LocalTime.NOON);
        vetBreak.setEndTime(LocalTime.MIDNIGHT);

        assertEquals(1L, vetBreak.getBreakId());
    }

    @Test
    void testVetLeaveEntity() {

        VetLeave leave = new VetLeave();

        leave.setLeaveId(1L);
        leave.setFromDate(LocalDate.now());
        leave.setToDate(LocalDate.now().plusDays(1));
        leave.setReason("Vacation");

        assertEquals(1L, leave.getLeaveId());
        assertEquals("Vacation", leave.getReason());
    }

    @Test
    void testVetWorkingHourEntity() {

        VetWorkingHour hour = new VetWorkingHour();

        hour.setWorkingHourId(1L);
        hour.setDayOfWeek(String.valueOf(DayOfWeek.MONDAY));
        hour.setStartTime(LocalTime.of(9, 0));
        hour.setEndTime(LocalTime.of(17, 0));

        assertEquals(1L, hour.getWorkingHourId());
    }

    @Test
    void testDoctorAppointmentTypeEntity() {

        DoctorAppointmentType mapping =
                new DoctorAppointmentType();

        Vet vet = new Vet();
        vet.setVetId(1L);

        AppointmentType type = new AppointmentType();
        type.setAppointmentTypeId(1L);

        mapping.setVet(vet);
        mapping.setAppointmentType(type);

        assertEquals(1L,
                mapping.getVet().getVetId());

        assertEquals(1L,
                mapping.getAppointmentType()
                        .getAppointmentTypeId());
    }

    @Test
    void testAuthUserEntity() {

        AuthUser user = new AuthUser();

        user.setUserId(1L);
        user.setName("John");
        user.setEmail("john@test.com");

        assertEquals("John", user.getName());
    }
}