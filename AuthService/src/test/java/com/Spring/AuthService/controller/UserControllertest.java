package com.Spring.AuthService.controller;

import com.Spring.AuthService.dto.UpdateProfileRequest;
import com.Spring.AuthService.entity.User;
import com.Spring.AuthService.service.UserService;
import com.Spring.AuthService.util.ResponseMessage;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @Test
    void testGetProfile() {

        User user = new User();
        user.setUserId(1L);

        when(userService.getUserProfile(1L))
                .thenReturn(user);

        ResponseEntity<ResponseMessage<User>> response =
                userController.getProfile(1L);

        assertEquals(200,
                response.getBody().getStatus());

        assertEquals(user,
                response.getBody().getData());

        verify(userService, times(1))
                .getUserProfile(1L);
    }

    @Test
    void testUpdateProfile() {

        UpdateProfileRequest request =
                new UpdateProfileRequest();

        User user = new User();
        user.setUserId(1L);

        when(userService.updateProfile(1L, request))
                .thenReturn(user);

        ResponseEntity<ResponseMessage<User>> response =
                userController.updateProfile(1L, request);

        assertEquals(200,
                response.getBody().getStatus());

        assertEquals(user,
                response.getBody().getData());

        verify(userService, times(1))
                .updateProfile(1L, request);
    }
}