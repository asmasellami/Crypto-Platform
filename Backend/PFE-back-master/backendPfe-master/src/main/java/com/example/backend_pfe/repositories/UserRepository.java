package com.example.backend_pfe.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.backend_pfe.entities.User;


public interface UserRepository extends JpaRepository<User, Long> {
	
	User findByUsername(String username);
	Optional<User> findByEmail(String email);

	@Query(value = "SELECT DATE(u.created_at) AS registration_date, COUNT(u.user_id) AS registration_count FROM User u GROUP BY DATE(u.created_at) ORDER BY registration_date", nativeQuery = true)
	List<Object[]> getUserRegistrationTrend();
	
}