package com.example.backend_pfe.restcontrollers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend_pfe.entities.Notification;
import com.example.backend_pfe.repositories.NotificationRepository;
import com.example.backend_pfe.services.AlertService;
import com.example.backend_pfe.services.NotificationService;
import com.example.backend_pfe.services.UserService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

@RestController
public class NotificationRestcontroller {
	
	 @Autowired
	 private NotificationRepository notificationRepository;
	 
	 
	 
	@Autowired
	private UserService userService ;
	
	 @Autowired
     private NotificationService notificationService;
	 
	 
	 @Autowired
     private AlertService alertService;
		
	 
	 
	 @GetMapping("/notifications")
	    public ResponseEntity<List<Notification>> getNotificationsForCurrentUser() {
	        Long currentUserId = userService.getCurrentUserId();
	        if (currentUserId == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
	        }
	        List<Notification> notifications = notificationService.getNotifUser(currentUserId);
	        return ResponseEntity.ok(notifications);
	    }
	 
	
	 @PutMapping("/viewed/{userId}")
	    public ResponseEntity<Void> markNotificationsAsViewed(@PathVariable Long userId) {
	        List<Notification> notifications = notificationRepository.findByUserIdAndViewed(userId, false);
	        for (Notification notification : notifications) {
	            notification.setViewed(true);
	            notificationRepository.save(notification);
	        }
	        return ResponseEntity.ok().build();
	    }
	 
	 @PostMapping("/markAllAsViewed/{userId}")
	 public ResponseEntity<?> markAllNotificationsAsViewed(@PathVariable Long userId) {
	     notificationService.markAllNotificationsAsViewed(userId);
	     return ResponseEntity.ok().build();
	 }

	 
	 
	  @GetMapping("/ticker-details/{id}")
	    public ResponseEntity<Map<String, Object>> getNotificationTickerDetails(@PathVariable Long id) {
	        Optional<Notification> notification = notificationRepository.findById(id);
	        if (notification.isPresent()) {
	            String tickerDetails = notification.get().getTickerDetails();
	            if (tickerDetails != null) {
	              
	                ObjectMapper objectMapper = new ObjectMapper();
	                try {
	                    Map<String, Object> details = objectMapper.readValue(tickerDetails, new TypeReference<Map<String, Object>>() {});
	                    return ResponseEntity.ok(details);
	                } catch (JsonProcessingException e) {
	                    e.printStackTrace();
	                    Map<String, Object> errorResponse = new HashMap<>();
	                    errorResponse.put("error", "Failed to parse ticker details");
	                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
	                }
	            } else {
	                Map<String, Object> errorResponse = new HashMap<>();
	                errorResponse.put("error", "No ticker details found for this notification");
	                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
	            }
	        } else {
	            Map<String, Object> errorResponse = new HashMap<>();
	            errorResponse.put("error", "Notification not found");
	            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
	        }
	    }
	  @DeleteMapping("notification/{id}")
	    public ResponseEntity<?> deleteNotification(@PathVariable Long id) {
	        notificationRepository.deleteById(id);
	        return ResponseEntity.ok().build();
	    }
	
	  
	  @DeleteMapping("/deleteAllNotif")
	    public ResponseEntity<Void> deleteAllNotifications() {
	        Long currentUserId = userService.getCurrentUserId();
	        if (currentUserId == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
	        }
	        List<Notification> notifications = notificationRepository.findByUserId(currentUserId);
	        notificationRepository.deleteAll(notifications);
	        return ResponseEntity.ok().build();
	    }
}