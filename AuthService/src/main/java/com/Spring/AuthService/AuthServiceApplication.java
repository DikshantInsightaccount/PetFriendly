package com.Spring.AuthService;

import com.Spring.AuthService.entity.Role;
import com.Spring.AuthService.entity.User;
import com.Spring.AuthService.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class AuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

	// BOOTSTRAP ONE ADMIN (RUNS ONLY IF ADMIN DOESN'T EXIST)
	@Bean
	CommandLineRunner bootstrapAdmin(UserRepository userRepository) {
		return args -> {

			String adminEmail = "admin@petclinic.com";

			if (userRepository.findByEmail(adminEmail).isPresent()) {
				return; // Admin already exists → do nothing
			}

			BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

			User admin = new User();
			admin.setName("Super Admin");
			admin.setEmail(adminEmail);
			admin.setPhoneNumber("9999999888");
			admin.setAddress("Hyderabad");
			admin.setRole(Role.ADMIN);
			admin.setActive(true);
			admin.setPasswordHash(encoder.encode("Admin@123"));

			userRepository.save(admin);

			System.out.println("BOOTSTRAP ADMIN CREATED: admin@petclinic.com");
		};
	}
}