package com.Spring.AuthService.controller;

import com.Spring.AuthService.dto.UpdateProfileRequest;
import com.Spring.AuthService.entity.User;
import com.Spring.AuthService.service.UserService;
import com.Spring.AuthService.util.ResponseMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // View own profile
    @GetMapping("/me")
    public ResponseEntity<ResponseMessage<User>> getProfile(
            @RequestHeader("X-User-Id") Long userId) {

        return ResponseEntity.ok(
                new ResponseMessage<>(
                        "User profile fetched successfully",
                        200,
                        userService.getUserProfile(userId)
                )
        );
    }

    // Update own email / phone / address
    @PatchMapping("/me")
    public ResponseEntity<ResponseMessage<User>> updateProfile(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody UpdateProfileRequest request) {

        return ResponseEntity.ok(
                new ResponseMessage<>(
                        "Profile updated successfully",
                        200,
                        userService.updateProfile(userId, request)
                )
        );
    }
}