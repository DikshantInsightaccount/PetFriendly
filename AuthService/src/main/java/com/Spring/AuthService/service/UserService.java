package com.Spring.AuthService.service;

import com.Spring.AuthService.dto.UpdateProfileRequest;
import com.Spring.AuthService.entity.User;
import com.Spring.AuthService.exception.UserException;
import com.Spring.AuthService.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getUserProfile(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found"));
    }

    public User updateProfile(Long userId, UpdateProfileRequest request) {

        User user = getUserProfile(userId);

        if (request.email != null &&
                !request.email.equals(user.getEmail()) &&
                userRepository.findByEmail(request.email).isPresent()) {
            throw new UserException("Email already in use");
        }

        if (request.email != null) user.setEmail(request.email);
        if (request.phoneNumber != null) user.setPhoneNumber(request.phoneNumber);
        if (request.address != null) user.setAddress(request.address);

        return userRepository.save(user);
    }
}