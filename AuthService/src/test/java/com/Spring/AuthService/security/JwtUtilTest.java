package com.Spring.AuthService.security;

import com.Spring.AuthService.entity.Role;
import com.Spring.AuthService.entity.User;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    private User user;

    @BeforeEach
    void setUp() {

        jwtUtil = new JwtUtil();

        user = new User();

        user.setUserId(1L);
        user.setName("Test User");
        user.setEmail("test@gmail.com");
        user.setRole(Role.ADMIN);
    }

    @Test
    void testGenerateToken() {

        String token =
                jwtUtil.generateToken(user);

        assertNotNull(token);

        assertFalse(token.isEmpty());
    }

    @Test
    void testValidateToken() {

        String token =
                jwtUtil.generateToken(user);

        Claims claims =
                jwtUtil.validateToken(token);

        assertNotNull(claims);

        assertEquals(
                "1",
                claims.getSubject()
        );

        assertEquals(
                "ADMIN",
                claims.get("role")
        );
    }

    @Test
    void testValidateInvalidToken() {

        assertThrows(
                JwtException.class,
                () -> jwtUtil.validateToken(
                        "invalid-token"
                )
        );
    }
}