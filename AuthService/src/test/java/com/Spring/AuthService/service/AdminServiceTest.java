package com.Spring.AuthService.service;

import com.Spring.AuthService.dto.AdminCreateUserRequest;
import com.Spring.AuthService.entity.Role;
import com.Spring.AuthService.entity.User;
import com.Spring.AuthService.exception.AuthorizationException;
import com.Spring.AuthService.exception.UserException;
import com.Spring.AuthService.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AdminServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AdminService adminService;

    private User user;

    @BeforeEach
    void setUp() {

        user = new User();
        user.setUserId(1L);
        user.setName("Test User");
        user.setEmail("test@gmail.com");
        user.setRole(Role.ADMIN);
        user.setActive(true);
    }

    @Test
    void testCreateUser() {

        AdminCreateUserRequest request =
                new AdminCreateUserRequest();

        request.name = "Test";
        request.email = "test@gmail.com";
        request.password = "1234";
        request.role = Role.VET;

        when(userRepository.findByEmail(request.email))
                .thenReturn(Optional.empty());

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        User savedUser = adminService.createUser(request);

        assertNotNull(savedUser);

        verify(userRepository, times(1))
                .save(any(User.class));
    }

    @Test
    void testCreateUserThrowsAuthorizationException() {

        AdminCreateUserRequest request =
                new AdminCreateUserRequest();

        request.role = Role.OWNER;

        assertThrows(
                AuthorizationException.class,
                () -> adminService.createUser(request)
        );
    }

    @Test
    void testCreateUserThrowsUserException() {

        AdminCreateUserRequest request =
                new AdminCreateUserRequest();

        request.email = "test@gmail.com";
        request.role = Role.ADMIN;

        when(userRepository.findByEmail(request.email))
                .thenReturn(Optional.of(user));

        assertThrows(
                UserException.class,
                () -> adminService.createUser(request)
        );
    }

    @Test
    void testGetAllUsers() {

        List<User> users = new ArrayList<>();
        users.add(user);

        when(userRepository.findAll())
                .thenReturn(users);

        List<User> result =
                adminService.getAllUsers();

        assertEquals(1, result.size());

        verify(userRepository, times(1))
                .findAll();
    }

    @Test
    void testGetUserById() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        User result =
                adminService.getUserById(1L);

        assertEquals(1L,
                result.getUserId());

        verify(userRepository, times(1))
                .findById(1L);
    }

    @Test
    void testGetUserByIdThrowsException() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                UserException.class,
                () -> adminService.getUserById(1L)
        );
    }

    @Test
    void testToggleUserStatus() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        User updatedUser =
                adminService.toggleUserStatus(1L);

        assertFalse(updatedUser.isActive());

        verify(userRepository, times(1))
                .save(user);
    }
}