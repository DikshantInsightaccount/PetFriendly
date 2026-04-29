package com.example.demo.entities;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pets")
public class Petentity {

    public Petentity(String name, LocalDate dateOfBirth, String type, String breed, String gender, Long ownerId, LocalDateTime created_at, LocalDateTime updated_at) {
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.type = type;
        this.breed = breed;
        this.gender = gender;
        this.ownerId = ownerId;
        this.created_at = created_at;
        this.updated_at = updated_at;
    }

    public Petentity() {
    }

    public Long getId() {
        return Id;
    }

    public void setId(Long petId) {
        this.Id = petId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getBreed() {
        return breed;
    }

    public void setBreed(String breed) {
        this.breed = breed;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Long getOwnerId() {
        return ownerId;
    }

    public void setOwnerId(Long ownerId) {
        this.ownerId = ownerId;
    }

    public LocalDateTime getCreated_at() {
        return created_at;
    }

    public void setCreated_at(LocalDateTime created_at) {
        this.created_at = created_at;
    }

    public LocalDateTime getUpdated_at() {
        return updated_at;
    }

    public void setUpdated_at(LocalDateTime updated_at) {
        this.updated_at = updated_at;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    @Column(name="petId")
    private Long Id;

    private String name;
    private LocalDate dateOfBirth;
    private String type;
    private String breed;
    private String gender;

    @Column(name="owner_id")
    private Long ownerId;
    // user-service reference
    private LocalDateTime created_at;
    private LocalDateTime updated_at;
}