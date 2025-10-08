package com.example.backend_pfe.entities;


import jakarta.persistence.Entity;
import jakarta.persistence.*;
import jakarta.persistence.GenerationType;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Channel {
	@Id
	@GeneratedValue (strategy=GenerationType.IDENTITY) 
    private Long id;
	
    private long userId;
    private String email;
  
}
