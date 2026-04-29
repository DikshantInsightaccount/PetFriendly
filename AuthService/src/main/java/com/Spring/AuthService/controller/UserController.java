package com.Spring.AuthService.controller;

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

    @GetMapping("/me")
    public ResponseEntity<ResponseMessage<User>> getProfile(
            @RequestHeader("X-User-Id") Long userId) {

        User user = userService.getUserProfile(userId);

        return ResponseEntity.ok(
                new ResponseMessage<>(
                        "User profile fetched successfully",
                        200,
                        user
                )
        );
    }
}