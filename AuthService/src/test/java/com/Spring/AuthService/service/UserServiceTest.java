package com.Spring.AuthService.service;

import com.Spring.AuthService.dto.UpdateProfileRequest;
import com.Spring.AuthService.entity.User;
import com.Spring.AuthService.exception.UserException;
import com.Spring.AuthService.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User user;

    @BeforeEach
    void setUp() {

        user = new User();
        user.setUserId(1L);
        user.setEmail("test@gmail.com");
        user.setPhoneNumber("9999999999");
    }

    @Test
    void testGetUserProfile() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        User result =
                userService.getUserProfile(1L);

        assertEquals(
                1L,
                result.getUserId()
        );
    }

    @Test
    void testGetUserProfileThrowsException() {

        when(userRepository.findById(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                UserException.class,
                () -> userService.getUserProfile(1L)
        );
    }

    @Test
    void testUpdateProfile() {

        UpdateProfileRequest request =
                new UpdateProfileRequest();

        request.email = "new@gmail.com";
        request.phoneNumber = "8888888888";

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userRepository.findByEmail(request.email))
                .thenReturn(Optional.empty());

        when(userRepository.save(any(User.class)))
                .thenReturn(user);

        User updatedUser =
                userService.updateProfile(1L, request);

        assertNotNull(updatedUser);

        verify(userRepository, times(1))
                .save(user);
    }

    @Test
    void testUpdateProfileThrowsException() {

        UpdateProfileRequest request =
                new UpdateProfileRequest();

        request.email = "existing@gmail.com";

        User existingUser = new User();
        existingUser.setEmail("existing@gmail.com");

        when(userRepository.findById(1L))
                .thenReturn(Optional.of(user));

        when(userRepository.findByEmail(request.email))
                .thenReturn(Optional.of(existingUser));

        assertThrows(
                UserException.class,
                () -> userService.updateProfile(1L, request)
        );
    }
}