package com.gov.script_site.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

import com.gov.script_site.entity.User;

public interface UserRepository extends JpaRepository<User, UUID> {
    public Optional<User> findByUsername(String username);

}
