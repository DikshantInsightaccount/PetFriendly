package com.Spring.AuthService.repository;

import com.Spring.AuthService.entity.Role;
import com.Spring.AuthService.entity.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class UserRepositoryTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void testSaveUser() {

        User user = new User();

        user.setName("Test User");
        user.setEmail("test@gmail.com");
        user.setPhoneNumber("9999999999");
        user.setPasswordHash("password");
        user.setAddress("Hyderabad");
        user.setRole(Role.OWNER);
        user.setActive(true);

        User savedUser =
                userRepository.save(user);

        assertNotNull(savedUser);

        assertNotNull(
                savedUser.getUserId()
        );

        assertEquals(
                "test@gmail.com",
                savedUser.getEmail()
        );
    }

    @Test
    void testFindByEmail() {

        User user = new User();

        user.setName("Another User");
        user.setEmail("find@gmail.com");
        user.setPhoneNumber("8888888888");
        user.setPasswordHash("password");
        user.setAddress("Bangalore");
        user.setRole(Role.ADMIN);
        user.setActive(true);

        userRepository.save(user);

        Optional<User> foundUser =
                userRepository.findByEmail(
                        "find@gmail.com"
                );

        assertTrue(
                foundUser.isPresent()
        );

        assertEquals(
                "find@gmail.com",
                foundUser.get().getEmail()
        );
    }

    @Test
    void testFindByEmailNotFound() {

        Optional<User> foundUser =
                userRepository.findByEmail(
                        "unknown@gmail.com"
                );

        assertFalse(
                foundUser.isPresent()
        );
    }
}