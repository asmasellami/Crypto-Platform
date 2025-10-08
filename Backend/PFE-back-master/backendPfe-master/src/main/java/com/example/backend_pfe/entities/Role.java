package com.example.backend_pfe.entities;


import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToMany;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor
@Entity
public class Role {
	
@Id
@GeneratedValue (strategy=GenerationType.IDENTITY) 
private Long role_id;

private String role;

@ManyToMany(mappedBy = "roles", cascade = CascadeType.ALL)
private List<User> users;
}
