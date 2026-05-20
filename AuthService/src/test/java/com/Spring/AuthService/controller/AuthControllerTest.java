package com.Spring.AuthService.controller;

import com.Spring.AuthService.dto.LoginRequest;
import com.Spring.AuthService.dto.RegisterRequest;
import com.Spring.AuthService.dto.TokenResponse;
import com.Spring.AuthService.entity.User;
import com.Spring.AuthService.service.AuthService;
import com.Spring.AuthService.util.ResponseMessage;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    @Test
    void testRegister() {

        RegisterRequest request =
                new RegisterRequest();

        User user = new User();
        user.setUserId(1L);

        when(authService.register(request))
                .thenReturn(user);

        ResponseEntity<ResponseMessage<User>> response =
                authController.register(request);

        assertEquals(200,
                response.getBody().getStatus());

        assertEquals(user,
                response.getBody().getData());

        verify(authService, times(1))
                .register(request);
    }

    @Test
    void testLogin() {

        LoginRequest request =
                new LoginRequest();

        when(authService.login(request))
                .thenReturn("jwt-token");

        ResponseEntity<ResponseMessage<TokenResponse>> response =
                authController.login(request);

        assertEquals(200,
                response.getBody().getStatus());

        assertEquals(
                "jwt-token",
                response.getBody().getData().accessToken
        );

        verify(authService, times(1))
                .login(request);
    }

    @Test
    void testValidate() {

        Claims claims = mock(Claims.class);

        when(claims.getSubject())
                .thenReturn("1");

        when(claims.get("role"))
                .thenReturn("ADMIN");

        when(authService.validate("token"))
                .thenReturn(claims);

        ResponseEntity<ResponseMessage<Map<String, Object>>> response =
                authController.validate("Bearer token");

        assertEquals(200,
                response.getBody().getStatus());

        assertEquals(
                "1",
                response.getBody().getData().get("userId")
        );

        assertEquals(
                "ADMIN",
                response.getBody().getData().get("role")
        );

        verify(authService, times(1))
                .validate("token");
    }
}