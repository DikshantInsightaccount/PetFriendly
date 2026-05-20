package com.Spring.AuthService.controller;

import com.Spring.AuthService.dto.AdminCreateUserRequest;
import com.Spring.AuthService.entity.User;
import com.Spring.AuthService.service.AdminService;
import com.Spring.AuthService.util.ResponseMessage;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    // Create VET / ADMIN (ADMIN only)
    @PostMapping
    public ResponseEntity<ResponseMessage<User>> createUser(
            @RequestBody AdminCreateUserRequest request) {

        User user = adminService.createUser(request);

        return ResponseEntity.ok(
                new ResponseMessage<>(
                        "User created successfully",
                        200,
                        user
                )
        );
    }

    @GetMapping
    public ResponseEntity<ResponseMessage<List<User>>> getAllUsers() {

        return ResponseEntity.ok(
                new ResponseMessage<>(
                        "Users fetched successfully",
                        200,
                        adminService.getAllUsers()
                )
        );
    }

    @GetMapping("/{userId}")
    public ResponseEntity<ResponseMessage<User>> getUser(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                new ResponseMessage<>(
                        "User fetched successfully",
                        200,
                        adminService.getUserById(userId)
                )
        );
    }

    @PatchMapping("/{userId}/status")
    public ResponseEntity<ResponseMessage<User>> toggleStatus(
            @PathVariable Long userId) {

        return ResponseEntity.ok(
                new ResponseMessage<>(
                        "User status updated successfully",
                        200,
                        adminService.toggleUserStatus(userId)
                )
        );
    }
}
