package com.Spring.AuthService.controller;

import com.Spring.AuthService.dto.AdminCreateUserRequest;
import com.Spring.AuthService.entity.User;
import com.Spring.AuthService.service.AdminService;
import com.Spring.AuthService.util.ResponseMessage;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminControllerTest {

    @Mock
    private AdminService adminService;

    @InjectMocks
    private AdminController adminController;

    private User user;

    @BeforeEach
    void setUp() {

        user = new User();
        user.setUserId(1L);
        user.setName("Test User");
    }

    @Test
    void testCreateUser() {

        AdminCreateUserRequest request =
                new AdminCreateUserRequest();

        when(adminService.createUser(request))
                .thenReturn(user);

        ResponseEntity<ResponseMessage<User>> response =
                adminController.createUser(request);

        assertNotNull(response);
        assertNotNull(response.getBody());

        assertEquals(200,
                response.getBody().getStatus());

        assertEquals("User created successfully",
                response.getBody().getMessage());

        assertEquals(user,
                response.getBody().getData());

        verify(adminService, times(1))
                .createUser(request);
    }

    @Test
    void testGetAllUsers() {

        List<User> users = new ArrayList<>();
        users.add(user);

        when(adminService.getAllUsers())
                .thenReturn(users);

        ResponseEntity<ResponseMessage<List<User>>> response =
                adminController.getAllUsers();

        assertEquals(200,
                response.getBody().getStatus());

        assertEquals(users,
                response.getBody().getData());

        verify(adminService, times(1))
                .getAllUsers();
    }

    @Test
    void testGetUser() {

        when(adminService.getUserById(1L))
                .thenReturn(user);

        ResponseEntity<ResponseMessage<User>> response =
                adminController.getUser(1L);

        assertEquals(200,
                response.getBody().getStatus());

        assertEquals(user,
                response.getBody().getData());

        verify(adminService, times(1))
                .getUserById(1L);
    }

    @Test
    void testToggleStatus() {

        when(adminService.toggleUserStatus(1L))
                .thenReturn(user);

        ResponseEntity<ResponseMessage<User>> response =
                adminController.toggleStatus(1L);

        assertEquals(200,
                response.getBody().getStatus());

        assertEquals(user,
                response.getBody().getData());

        verify(adminService, times(1))
                .toggleUserStatus(1L);
    }
}