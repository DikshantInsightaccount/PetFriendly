package com.example.demo.DTO;

public class AppointmentWithPetDto {

    private Long appointmentId;
    private Long petId;
    private String petName;
    private String petType;
    private String petBreed;
    private Long vetId;
    private String status;

    public AppointmentWithPetDto(
            Long appointmentId,
            Long petId,
            String petName,
            String petType,
            String petBreed,
            Long vetId,
            String status
    ) {
        this.appointmentId = appointmentId;
        this.petId = petId;
        this.petName = petName;
        this.petType = petType;
        this.petBreed = petBreed;
        this.vetId = vetId;
        this.status = status;
    }

    // ✅ getters only (DTO)
    public Long getAppointmentId() { return appointmentId; }
    public Long getPetId() { return petId; }
    public String getPetName() { return petName; }
    public String getPetType() { return petType; }
    public String getPetBreed() { return petBreed; }
    public Long getVetId() { return vetId; }
    public String getStatus() { return status; }
}