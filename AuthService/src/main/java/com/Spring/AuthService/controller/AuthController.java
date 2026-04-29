package com.Spring.AuthService.controller;

import com.Spring.AuthService.dto.LoginRequest;
import com.Spring.AuthService.dto.RegisterRequest;
import com.Spring.AuthService.dto.TokenResponse;
import com.Spring.AuthService.entity.User;
import com.Spring.AuthService.service.AuthService;
import com.Spring.AuthService.util.ResponseMessage;
import io.jsonwebtoken.Claims;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    // ✅ Public — OWNER only
    @PostMapping("/register")
    public ResponseEntity<ResponseMessage<User>> register(
            @RequestBody RegisterRequest request) {

        User user = authService.register(request);

        return ResponseEntity.ok(
                new ResponseMessage<>(
                        "User registered successfully",
                        200,
                        user
                )
        );
    }

    @PostMapping("/login")
    public ResponseEntity<ResponseMessage<TokenResponse>> login(
            @RequestBody LoginRequest request) {

        String token = authService.login(request);

        return ResponseEntity.ok(
                new ResponseMessage<>(
                        "Login successful",
                        200,
                        new TokenResponse(token)
                )
        );
    }

    // ✅ Gateway-only
    @PostMapping("/validate")
    public ResponseEntity<ResponseMessage<Map<String, Object>>> validate(
            @RequestHeader("Authorization") String token) {

        Claims claims = authService.validate(
                token.replace("Bearer ", "")
        );

        Map<String, Object> data = Map.of(
                "userId", claims.getSubject(),
                "role", claims.get("role")
        );

        return ResponseEntity.ok(
                new ResponseMessage<>(
                        "Token validated successfully",
                        200,
                        data
                )
        );
    }
}
