package com.example.backend_pfe.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@NoArgsConstructor 
@AllArgsConstructor
@Entity
public class Alert {
	
	@Id
	@GeneratedValue (strategy=GenerationType.IDENTITY) 
    private Long id; 
	
	private String name;

	
    private long userId;

    private String fieldName;
    private String operator;
    private double threshold;
    private boolean emailNotification;
    
    private String triggerFrequency;

    private String type;
    
    private boolean active;
  
    
}
