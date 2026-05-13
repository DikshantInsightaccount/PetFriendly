package com.Spring.AuthService.service;

import com.Spring.AuthService.dto.AdminCreateUserRequest;
import com.Spring.AuthService.entity.Role;
import com.Spring.AuthService.entity.User;
import com.Spring.AuthService.exception.AuthorizationException;
import com.Spring.AuthService.exception.UserException;
import com.Spring.AuthService.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

// ✅ your HTTP client class that calls VetService
import com.Spring.AuthService.client.VetServiceClient;

import java.util.List;

@Service
public class AdminService {

    private final UserRepository userRepository;
//    private final VetServiceClient vetServiceClient;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AdminService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * ✅ IMPORTANT:
     * This method is NOT @Transactional.
     * We commit user creation first, then call VetService,
     * then compensate if VetService fails.
     */
    public User createUser(AdminCreateUserRequest request) {

        if (request.role == Role.OWNER) {
            throw new AuthorizationException("Admin cannot create OWNER");
        }

        // ✅ ONLY create the user
        // ❌ DO NOT call VetService here
        return createUserTx(request);
    }


    @Transactional
    protected User createUserTx(AdminCreateUserRequest request) {
        // Optional: prevent duplicates early (DB unique constraints still apply)
        if (userRepository.findByEmail(request.email).isPresent()) {
            throw new UserException("Email already in use");
        }

        User user = new User();
        user.setName(request.name);
        user.setEmail(request.email);
        user.setPhoneNumber(request.phoneNumber);
        user.setAddress(request.address);
        user.setRole(request.role);
        user.setPasswordHash(encoder.encode(request.password));

        return userRepository.save(user);
    }

    @Transactional
    protected void disableUserTx(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserException("User not found"));
        user.setActive(false);
        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public User getUserById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new UserException("User not found"));
    }

    public User toggleUserStatus(Long id) {
        User user = getUserById(id);
        user.setActive(!user.isActive());
        return userRepository.save(user);
    }
}
