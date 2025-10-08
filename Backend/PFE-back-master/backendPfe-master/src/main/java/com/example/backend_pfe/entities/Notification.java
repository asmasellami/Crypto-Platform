package com.example.backend_pfe.entities;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;


import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Notification {
	
	@Id
	@GeneratedValue (strategy=GenerationType.IDENTITY) 
    private Long id;
    private long alertId;
    private String username;
    private long userId;
    private String message;
    private boolean isSent;
    private LocalDateTime createdAt;
    private boolean viewed;
    private String tickerDetails;
    
    
    private String alertName;      
    private String alertType;      
    private String alertFieldName;
    private String alertoperator;
    private double alertthreshold;
}
