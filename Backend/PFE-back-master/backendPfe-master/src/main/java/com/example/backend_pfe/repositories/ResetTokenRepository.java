package com.example.backend_pfe.repositories;


import java.util.Optional;
import org.springframework.data.repository.CrudRepository;

import com.example.backend_pfe.entities.ResetToken;


public interface ResetTokenRepository extends CrudRepository<ResetToken, Integer> {

    Optional<ResetToken> findByCode(String code);
}
