package com.Spring.AuthService.service;

import com.Spring.AuthService.dto.RegisterRequest;
import com.Spring.AuthService.entity.Role;
import com.Spring.AuthService.entity.User;
import com.Spring.AuthService.exception.UserException;
import com.Spring.AuthService.exception.AuthorizationException;
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

    public User createUser(RegisterRequest request) {

        if (request.role == Role.OWNER) {
            throw new AuthorizationException("Admin cannot create OWNER");
        }

        if (userRepository.findByEmail(request.email).isPresent()) {
            throw new UserException("User already exists");
        }

        User user = new User();
        user.setName(request.name);
        user.setEmail(request.email);
        user.setPhoneNumber(request.phoneNumber);
        user.setRole(request.role);
        user.setPasswordHash(encoder.encode(request.password));
        user.setActive(true);

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found"));
    }

    public User toggleUserStatus(Long userId) {
        User user = getUserById(userId);
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }
}