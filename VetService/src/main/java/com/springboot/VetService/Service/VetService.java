package com.springboot.VetService.Service;

import com.springboot.VetService.DTO.VetSummaryDto;
import com.springboot.VetService.Entity.*;
import com.springboot.VetService.Exceptions.VetServiceException;
import com.springboot.VetService.Repository.*;
import com.springboot.VetService.events.VetWorkingHoursSavedEvent;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class VetService {

    private static final String SLOT_GENERATE_URL =
            "http://localhost:8085/slots/generate";

    private final VetRepository vetRepository;
    private final VetWorkingHourRepository vetWorkingHourRepository;
    private final VetBreakRepository vetBreakRepository;
    private final AppointmentTypeRepository appointmentTypeRepository;
    private final DoctorAppointmentTypeRepository doctorAppointmentTypeRepository;
    private final VetLeaveRepository vetLeaveRepository;
    private final AuthUserRepository authUserRepository;
    private final RestTemplate restTemplate;
    private final ApplicationEventPublisher eventPublisher;

    public VetService(
            VetRepository vetRepository,
            VetWorkingHourRepository vetWorkingHourRepository,
            VetBreakRepository vetBreakRepository,
            AppointmentTypeRepository appointmentTypeRepository,
            DoctorAppointmentTypeRepository doctorAppointmentTypeRepository,
            VetLeaveRepository vetLeaveRepository,
            AuthUserRepository authUserRepository,
            ApplicationEventPublisher eventPublisher,
            RestTemplate restTemplate
    ) {
        this.vetRepository = vetRepository;
        this.vetWorkingHourRepository = vetWorkingHourRepository;
        this.vetBreakRepository = vetBreakRepository;
        this.appointmentTypeRepository = appointmentTypeRepository;
        this.doctorAppointmentTypeRepository = doctorAppointmentTypeRepository;
        this.vetLeaveRepository = vetLeaveRepository;
        this.authUserRepository = authUserRepository;
        this.eventPublisher = eventPublisher;
        this.restTemplate = restTemplate;
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
        VetWorkingHour saved = vetWorkingHourRepository.save(workingHour);

        // ✅ Publish event instead of calling slot generation inside the same transaction
        eventPublisher.publishEvent(new VetWorkingHoursSavedEvent(vetId));

        return saved;
    }

    /**
     * Called AFTER transaction commit by SlotGenerationListener
     */
    public void generateSlotsForNext4Weeks(Long vetId) {

        Map<String, Object> payload = Map.of(
                "vetId", vetId,
                "startDate", LocalDate.now().toString(),
                "days", 28,
                "slotMinutes", 30
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Internal gateway bypass + downstream auth headers
        headers.set("X-Internal-Call", "true");
        headers.set("X-User-Id", "0");
        headers.set("X-Role", "ADMIN");

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(payload, headers);

        try {
            restTemplate.postForEntity(
                    SLOT_GENERATE_URL,
                    request,
                    Void.class
            );

            System.out.println("✅ Slot generation triggered for vetId=" + vetId);

        } catch (Exception ex) {
            System.err.println("❌ Slot generation failed for vetId=" + vetId);
            ex.printStackTrace();
        }
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

        if (leave.getFromDate() == null || leave.getToDate() == null) {
            throw new VetServiceException("fromDate and toDate are required");
        }

        if (leave.getToDate().isBefore(leave.getFromDate())) {
            throw new VetServiceException("Invalid leave date range");
        }

        leave.setVet(vet);

        if (vetLeaveRepository.existsByVet_VetIdAndFromDateAndToDate(
                vetId, leave.getFromDate(), leave.getToDate())) {
            throw new VetServiceException("Leave already exists for the given date range");
        }

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

    @Transactional(readOnly = true)
    public List<VetSummaryDto> getVetSummariesBySpeciality(String speciality) {

        List<Vet> vets = getVetsBySpeciality(speciality);

        List<Long> userIds = vets.stream()
                .map(Vet::getUserId)
                .distinct()
                .toList();

        var users = authUserRepository.findAllById(userIds);
        var userMap = users.stream()
                .collect(Collectors.toMap(AuthUser::getUserId, u -> u));

        return vets.stream()
                .map(v -> {
                    var u = userMap.get(v.getUserId());
                    String name = (u != null && u.getName() != null) ? u.getName() : ("Vet " + v.getVetId());
                    String email = (u != null) ? u.getEmail() : null;
                    return new VetSummaryDto(v.getVetId(), v.getUserId(), name, email);
                })
                .toList();
    }

    @Transactional
    public Vet createVetWithAppointmentTypes(Long userId, List<Long> appointmentTypeIds) {

        if (userId == null) {
            throw new VetServiceException("userId is required");
        }

        Vet savedVet = vetRepository.findByUserId(userId)
                .orElseGet(() -> {
                    Vet v = new Vet();
                    v.setUserId(userId);
                    return vetRepository.save(v);
                });

        if (appointmentTypeIds != null && !appointmentTypeIds.isEmpty()) {
            for (Long appointmentTypeId : appointmentTypeIds) {

                if (doctorAppointmentTypeRepository
                        .existsByVet_VetIdAndAppointmentType_AppointmentTypeId(
                                savedVet.getVetId(), appointmentTypeId)) {
                    continue;
                }

                AppointmentType appointmentType =
                        appointmentTypeRepository.findById(appointmentTypeId)
                                .orElseThrow(() ->
                                        new VetServiceException("Appointment type not found: " + appointmentTypeId));

                DoctorAppointmentType mapping = new DoctorAppointmentType();
                mapping.setVet(savedVet);
                mapping.setAppointmentType(appointmentType);

                doctorAppointmentTypeRepository.save(mapping);
            }
        }

        return savedVet;
    }

    @Transactional(readOnly = true)
    public List<VetSummaryDto> getAllVetSummaries() {

        List<Vet> vets = vetRepository.findAll();

        List<Long> userIds = vets.stream()
                .map(Vet::getUserId)
                .distinct()
                .toList();

        List<AuthUser> users = authUserRepository.findAllById(userIds);

        Map<Long, AuthUser> userMap = users.stream()
                .collect(Collectors.toMap(AuthUser::getUserId, u -> u));

        return vets.stream()
                .map(v -> {
                    AuthUser u = userMap.get(v.getUserId());
                    String name = (u != null && u.getName() != null) ? u.getName() : ("Vet " + v.getVetId());
                    String email = (u != null) ? u.getEmail() : null;
                    return new VetSummaryDto(v.getVetId(), v.getUserId(), name, email);
                })
                .toList();
    }
}