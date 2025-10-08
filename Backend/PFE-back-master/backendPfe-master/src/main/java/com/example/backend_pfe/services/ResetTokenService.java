package com.example.backend_pfe.services;


import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import com.example.backend_pfe.entities.ResetToken;
import com.example.backend_pfe.entities.User;
import com.example.backend_pfe.repositories.ResetTokenRepository;

import java.time.Instant;
import java.util.Random;

import static java.time.temporal.ChronoUnit.MINUTES;

@AllArgsConstructor
@Service
public class ResetTokenService {

    private ResetTokenRepository validationRepository;
    private NotificationService notificationService;

    public void enregistrer(User utilisateur) {
        ResetToken validation = new ResetToken();
        validation.setUtilisateur(utilisateur);
        Instant creation = Instant.now();
        validation.setCreation(creation);
        Instant expiration = creation.plus(10, MINUTES);
        validation.setExpiration(expiration);
        Random random = new Random();
        int randomInteger = random.nextInt(999999);
        String code = String.format("%06d", randomInteger);

        validation.setCode(code);
        this.validationRepository.save(validation);
        this.notificationService.envoyer(validation);
    }
    
    public void verifyAccount(User utilisateur) {
    	  ResetToken validation = new ResetToken();
          validation.setUtilisateur(utilisateur);
          Instant creation = Instant.now();
          validation.setCreation(creation);
          Instant expiration = creation.plus(10, MINUTES);
          validation.setExpiration(expiration);
          Random random = new Random();
          int randomInteger = random.nextInt(999999);
          String code = String.format("%06d", randomInteger);

          validation.setCode(code);
          this.validationRepository.save(validation);
          this.notificationService.envoyer(validation);
        
 	
    }

    public ResetToken lireEnFonctionDuCode(String code) {
        return this.validationRepository.findByCode(code).orElseThrow(() -> new RuntimeException("Votre code est invalide"));
    }
}