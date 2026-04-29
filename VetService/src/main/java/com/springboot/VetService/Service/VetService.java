package com.springboot.VetService.Service;

import com.springboot.VetService.Entity.*;
import com.springboot.VetService.Exceptions.VetServiceException;
import com.springboot.VetService.Repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class VetService {

    private final VetRepository vetRepository;
    private final VetWorkingHourRepository vetWorkingHourRepository;
    private final VetBreakRepository vetBreakRepository;
    private final AppointmentTypeRepository appointmentTypeRepository;
    private final DoctorAppointmentTypeRepository doctorAppointmentTypeRepository;
    private final VetLeaveRepository vetLeaveRepository;

    public VetService(
            VetRepository vetRepository,
            VetWorkingHourRepository vetWorkingHourRepository,
            VetBreakRepository vetBreakRepository,
            AppointmentTypeRepository appointmentTypeRepository,
            DoctorAppointmentTypeRepository doctorAppointmentTypeRepository,
            VetLeaveRepository vetLeaveRepository
    ) {
        this.vetRepository = vetRepository;
        this.vetWorkingHourRepository = vetWorkingHourRepository;
        this.vetBreakRepository = vetBreakRepository;
        this.appointmentTypeRepository = appointmentTypeRepository;
        this.doctorAppointmentTypeRepository = doctorAppointmentTypeRepository;
        this.vetLeaveRepository = vetLeaveRepository;
    }

    /* -----------------------------
       VET CORE
       ----------------------------- */

    public Vet createVet(Long userId) {
        if (vetRepository.findByUserId(userId).isPresent()) {
            throw new VetServiceException("Vet already exists for userId: " + userId);
        }

        Vet vet = new Vet();
        vet.setUserId(userId);
        return vetRepository.save(vet);
    }

    @Transactional(readOnly = true)
    public Vet getVetById(Long vetId) {
        return vetRepository.findById(vetId)
                .orElseThrow(() ->
                        new VetServiceException("Vet not found with id: " + vetId));
    }

    @Transactional(readOnly = true)
    public List<Vet> getVetsBySpeciality(String speciality) {
        return doctorAppointmentTypeRepository.findAll()
                .stream()
                .filter(mapping ->
                        mapping.getAppointmentType()
                                .getName()
                                .equalsIgnoreCase(speciality))
                .map(DoctorAppointmentType::getVet)
                .distinct()
                .collect(Collectors.toList());
    }

    /* -----------------------------
       WORKING HOURS
       ----------------------------- */

    public VetWorkingHour addWorkingHour(Long vetId, VetWorkingHour workingHour) {
        Vet vet = getVetById(vetId);

        if (!workingHour.getEndTime().isAfter(workingHour.getStartTime())) {
            throw new VetServiceException("Invalid working hours time range");
        }

        if (vetWorkingHourRepository
                .existsByVet_VetIdAndDayOfWeek(vetId, workingHour.getDayOfWeek())) {
            throw new VetServiceException(
                    "Working hours already exist for day: " + workingHour.getDayOfWeek());
        }

        workingHour.setVet(vet);
        return vetWorkingHourRepository.save(workingHour);
    }

    @Transactional(readOnly = true)
    public List<VetWorkingHour> getWorkingHours(Long vetId) {
        getVetById(vetId);
        return vetWorkingHourRepository.findByVet_VetId(vetId);
    }

    /* -----------------------------
       BREAKS
       ----------------------------- */

    public VetBreak addBreak(Long vetId, VetBreak vetBreak) {
        Vet vet = getVetById(vetId);

        if (!vetBreak.getEndTime().isAfter(vetBreak.getStartTime())) {
            throw new VetServiceException("Invalid break time range");
        }

        // ✅ DUPLICATE CHECK (THIS WAS MISSING)
        if (vetBreakRepository.existsByVet_VetIdAndStartTimeAndEndTime(
                vetId,
                vetBreak.getStartTime(),
                vetBreak.getEndTime())) {
            throw new VetServiceException(
                    "Break already exists for the given time range"
            );
        }

        vetBreak.setVet(vet);
        return vetBreakRepository.save(vetBreak);
    }

    @Transactional(readOnly = true)
    public List<VetBreak> getBreaks(Long vetId) {
        getVetById(vetId);
        return vetBreakRepository.findByVet_VetId(vetId);
    }

    /* -----------------------------
       LEAVE
       ----------------------------- */

    public VetLeave applyLeave(Long vetId, VetLeave leave) {
        Vet vet = getVetById(vetId);

        if (leave.getToDate().isBefore(leave.getFromDate())) {
            throw new VetServiceException("Invalid leave date range");
        }

        if (vetLeaveRepository
                .existsByVet_VetIdAndFromDateAndToDate(
                        vetId, leave.getFromDate(), leave.getToDate())) {
            throw new VetServiceException(
                    "Leave already exists for the given date range");
        }

        leave.setVet(vet);
        return vetLeaveRepository.save(leave);
    }

    @Transactional(readOnly = true)
    public List<VetLeave> getHolidaysForVet(Long vetId) {
        getVetById(vetId);
        return vetLeaveRepository.findByVet_VetId(vetId);
    }

    /* -----------------------------
       APPOINTMENT TYPES
       ----------------------------- */

    public AppointmentType createAppointmentType(AppointmentType appointmentType) {
        if (appointmentTypeRepository
                .findByNameIgnoreCase(appointmentType.getName())
                .isPresent()) {
            throw new VetServiceException(
                    "Appointment type already exists: " + appointmentType.getName());
        }

        return appointmentTypeRepository.save(appointmentType);
    }

    @Transactional(readOnly = true)
    public List<AppointmentType> getAllAppointmentTypes() {
        return appointmentTypeRepository.findAll();
    }

    public void assignAppointmentTypes(Long vetId, List<Long> appointmentTypeIds) {
        Vet vet = getVetById(vetId);

        for (Long appointmentTypeId : appointmentTypeIds) {

            if (doctorAppointmentTypeRepository
                    .existsByVet_VetIdAndAppointmentType_AppointmentTypeId(
                            vetId, appointmentTypeId)) {
                continue;
            }

            AppointmentType appointmentType =
                    appointmentTypeRepository.findById(appointmentTypeId)
                            .orElseThrow(() ->
                                    new VetServiceException(
                                            "Appointment type not found: " + appointmentTypeId));

            DoctorAppointmentType mapping = new DoctorAppointmentType();
            mapping.setVet(vet);
            mapping.setAppointmentType(appointmentType);

            doctorAppointmentTypeRepository.save(mapping);
        }
    }

    @Transactional(readOnly = true)
    public List<AppointmentType> getAppointmentTypesForVet(Long vetId) {
        getVetById(vetId);
        return doctorAppointmentTypeRepository
                .findByVet_VetId(vetId)
                .stream()
                .map(DoctorAppointmentType::getAppointmentType)
                .collect(Collectors.toList());
    }
}
