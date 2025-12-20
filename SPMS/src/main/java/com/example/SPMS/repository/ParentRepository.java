package com.example.SPMS.repository;

import com.example.SPMS.model.Parent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ParentRepository extends JpaRepository<Parent, Long> {
    Optional<Parent> findByEmail(String email);   // ← FIXED
    Optional<Parent> findByEmailAndPassword(String email, String password);


}

