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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private AuthService authService;

    private User user;

    @BeforeEach
    void setUp() {

        BCryptPasswordEncoder encoder =
                new BCryptPasswordEncoder();

        user = new User();

        user.setUserId(1L);
        user.setName("Yashwanth");
        user.setEmail("test@gmail.com");

        user.setPasswordHash(
                encoder.encode("1234")
        );

        user.setRole(Role.OWNER);
        user.setActive(true);
    }

    @Test
    void testRegisterSuccess() {

        RegisterRequest request =
                new RegisterRequest();

        request.name = "Yashwanth";
        request.email = "test@gmail.com";
        request.password = "1234";

        when(userRepository.findByEmail(
                request.email))
                .thenReturn(Optional.empty());

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        User savedUser =
                authService.register(request);

        assertNotNull(savedUser);

        assertEquals(
                "test@gmail.com",
                savedUser.getEmail()
        );
    }

    @Test
    void testRegisterUserAlreadyExists() {

        RegisterRequest request =
                new RegisterRequest();

        request.email = "test@gmail.com";

        when(userRepository.findByEmail(
                request.email))
                .thenReturn(Optional.of(user));

        assertThrows(
                UserException.class,
                () -> authService.register(request)
        );
    }

    @Test
    void testLoginSuccess() {

        LoginRequest request =
                new LoginRequest();

        request.email = "test@gmail.com";
        request.password = "1234";

        when(userRepository.findByEmail(
                request.email))
                .thenReturn(Optional.of(user));

        when(jwtUtil.generateToken(user))
                .thenReturn("jwt-token");

        String token =
                authService.login(request);

        assertEquals(
                "jwt-token",
                token
        );
    }

    @Test
    void testLoginUserNotFound() {

        LoginRequest request =
                new LoginRequest();

        request.email = "wrong@gmail.com";

        when(userRepository.findByEmail(
                request.email))
                .thenReturn(Optional.empty());

        assertThrows(
                AuthenticationException.class,
                () -> authService.login(request)
        );
    }

    @Test
    void testLoginWrongPassword() {

        LoginRequest request =
                new LoginRequest();

        request.email = "test@gmail.com";
        request.password = "wrong";

        when(userRepository.findByEmail(
                request.email))
                .thenReturn(Optional.of(user));

        assertThrows(
                AuthenticationException.class,
                () -> authService.login(request)
        );
    }

    @Test
    void testLoginInactiveUser() {

        LoginRequest request =
                new LoginRequest();

        request.email = "test@gmail.com";
        request.password = "1234";

        user.setActive(false);

        when(userRepository.findByEmail(
                request.email))
                .thenReturn(Optional.of(user));

        assertThrows(
                AuthenticationException.class,
                () -> authService.login(request)
        );
    }

    @Test
    void testValidateTokenSuccess() {

        Claims claims =
                mock(Claims.class);

        when(jwtUtil.validateToken("token"))
                .thenReturn(claims);

        Claims result =
                authService.validate("token");

        assertNotNull(result);
    }

    @Test
    void testValidateTokenFailure() {

        when(jwtUtil.validateToken("token"))
                .thenThrow(
                        new JwtException("Invalid token")
                );

        assertThrows(
                TokenException.class,
                () -> authService.validate("token")
        );
    }
}