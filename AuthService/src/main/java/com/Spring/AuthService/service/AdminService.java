package com.Spring.AuthService.service;

import com.Spring.AuthService.dto.AdminCreateUserRequest;
import com.Spring.AuthService.entity.*;
import com.Spring.AuthService.exception.*;
import com.Spring.AuthService.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public List<User> getAllVets() {
        return userRepository.findByRole(Role.VET);
    }

    public User createUser(AdminCreateUserRequest request) {

        if (request.role == Role.OWNER) {
            throw new AuthorizationException("Admin cannot create OWNER");
        }

        User user = new User();
        user.setName(request.name);
        user.setEmail(request.email);
        user.setPhoneNumber(request.phoneNumber);
        user.setAddress(request.address);
        user.setRole(request.role);
        user.setPasswordHash(encoder.encode(request.password));

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserException("User not found"));
    }

    public User toggleUserStatus(Long id) {
        User user = getUserById(id);
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }
}