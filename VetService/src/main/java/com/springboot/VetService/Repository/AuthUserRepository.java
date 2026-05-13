package com.springboot.VetService.Repository;

import com.springboot.VetService.Entity.AuthUser;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AuthUserRepository extends JpaRepository<AuthUser, Long> { }
