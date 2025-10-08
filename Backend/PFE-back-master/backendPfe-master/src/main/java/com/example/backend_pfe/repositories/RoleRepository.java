package com.example.backend_pfe.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.backend_pfe.entities.Role;



public interface RoleRepository extends JpaRepository<Role, Long> {
	
	Role findByRole(String role);

}
