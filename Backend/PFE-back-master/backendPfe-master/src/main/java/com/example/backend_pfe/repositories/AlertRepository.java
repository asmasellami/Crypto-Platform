package com.example.backend_pfe.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.example.backend_pfe.entities.Alert;

public interface AlertRepository extends JpaRepository<Alert, Long>{

	List<Alert> findByUserId(Long currentUserId);
	


}
