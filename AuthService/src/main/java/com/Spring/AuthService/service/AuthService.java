package com.Spring.AuthService.service;

import com.Spring.AuthService.dto.LoginRequest;
import com.Spring.AuthService.dto.RegisterRequest;
import com.Spring.AuthService.entity.Role;
import com.Spring.AuthService.entity.User;
import com.Spring.AuthService.exception.AuthenticationException;
import com.Spring.AuthService.exception.TokenException;
import com.Spring.AuthService.exception.UserException;
import com.Spring.AuthService.repository.UserRepository;
import com.Spring.AuthService.security.JwtUtil;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.jwtUtil = jwtUtil;
    }

    // OWNER only self-register
    public User register(RegisterRequest request) {

        if (request.role != Role.OWNER) {
            throw new AuthenticationException(
                    "Only customers are allowed to register");
        }

        if (userRepository.findByEmail(request.email).isPresent()) {
            throw new UserException("User already exists");
        }

        User user = new User();
        user.setName(request.name);
        user.setEmail(request.email);
        user.setPhoneNumber(request.phoneNumber);
        user.setRole(Role.OWNER);
        user.setPasswordHash(encoder.encode(request.password));

        return userRepository.save(user);
    }

    public String login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email)
                .orElseThrow(() ->
                        new AuthenticationException(
                                "Invalid email or password"));

        if (!user.isActive()) {
            throw new AuthenticationException("Account is disabled");
        }

        if (!encoder.matches(
                request.password,
                user.getPasswordHash())) {
            throw new AuthenticationException(
                    "Invalid email or password");
        }

        return jwtUtil.generateToken(user);
    }

    // Used by API Gateway
    public Claims validate(String token) {
        try {
            return jwtUtil.validateToken(token);
        } catch (JwtException ex) {
            throw new TokenException("Authentication token is invalid");
        }
    }
}