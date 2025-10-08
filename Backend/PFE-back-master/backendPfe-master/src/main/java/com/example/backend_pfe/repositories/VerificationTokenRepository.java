package com.example.backend_pfe.repositories;


import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend_pfe.entities.VerificationToken;



public interface VerificationTokenRepository extends
JpaRepository<VerificationToken, Long> {
 VerificationToken findByToken(String token);
}
