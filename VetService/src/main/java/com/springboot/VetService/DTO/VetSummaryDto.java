package com.springboot.VetService.DTO;


public class VetSummaryDto {
    private Long vetId;
    private Long userId;
    private String name;
    private String email;

    public VetSummaryDto(Long vetId, Long userId, String name, String email) {
        this.vetId = vetId;
        this.userId = userId;
        this.name = name;
        this.email = email;
    }

    public Long getVetId() { return vetId; }
    public Long getUserId() { return userId; }
    public String getName() { return name; }
    public String getEmail() {
        return email; }
}
