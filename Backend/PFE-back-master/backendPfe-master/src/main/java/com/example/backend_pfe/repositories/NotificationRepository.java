package com.example.backend_pfe.repositories;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.example.backend_pfe.entities.Notification;
import com.example.backend_pfe.entities.User;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    boolean existsByAlertIdAndUserId(String alertId, long userId);

	List<Notification> findByUserId(Long userId);

	List<Notification> findByUsername(String username);

	List<Notification> findAllByIsSentFalse();

	Notification findByAlertIdAndUserId(Long id, Long user_id);

	Notification findTopByAlertIdAndUserIdOrderByCreatedAtDesc(Long alertId, Long userId);

	List<Notification> findByUserIdAndViewed(Long userId, boolean b);

	//List<Notification> findByUserId(Long currentUserId);

}
