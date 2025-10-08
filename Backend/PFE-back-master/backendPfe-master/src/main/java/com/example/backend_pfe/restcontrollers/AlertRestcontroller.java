package com.example.backend_pfe.restcontrollers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.example.backend_pfe.entities.Alert;
import com.example.backend_pfe.entities.Notification;
import com.example.backend_pfe.entities.User;
import com.example.backend_pfe.repositories.AlertRepository;
import com.example.backend_pfe.services.AlertService;
import com.example.backend_pfe.services.NotificationService;
import com.example.backend_pfe.services.UserService;


@RestController
public class AlertRestcontroller {
	
	@Autowired
	AlertRepository alertRepository;
	
	@Autowired
	private AlertService alertService;

	@Autowired
	private UserService userService;

	@Autowired
	private NotificationService notificationService;

	@GetMapping("/currentUseralerts")
	public ResponseEntity<List<Alert>> getCurrentUserAlerts() {
		Long currentUserId = userService.getCurrentUserId();
		if (currentUserId == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
		}
		List<Alert> alerts = alertService.getAlertsForCurrentUser(currentUserId);
		return ResponseEntity.ok(alerts);
	}

	@PostMapping("/alerts")
	public ResponseEntity<Alert> createAlert(@RequestBody Alert alert) {
		Alert newAlert = alertService.addAlert(alert);
		System.out.print(alert);
		return ResponseEntity.ok(newAlert);
	}

	@PutMapping("/updateAlert/{id}")
	public ResponseEntity<Alert> updateAlert(@PathVariable long id, @RequestBody Alert alert) {
		Alert updatedAlert = alertService.updateAlert(id, alert);
		return ResponseEntity.ok(updatedAlert);
	}

	@RequestMapping(value = "/deleteAlert/{id}", method = RequestMethod.DELETE)
	public void deleteAlerte(@PathVariable("id") long alertId) {
		alertService.deleteAlert(alertId);
	}

	@GetMapping("/alertbyid/{id}")
	public ResponseEntity<Alert> getAlertById(@PathVariable Long id) {
		Optional<Alert> alert = alertService.getAlertById(id);
		if (alert.isPresent()) {
			return ResponseEntity.ok(alert.get());
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	
	@PutMapping("/enableAlert/{id}")
	public ResponseEntity<Alert> enableAlert(@PathVariable Long id) {
		Optional<Alert> alert = alertService.getAlertById(id);
		if (alert.isPresent()) {
			Alert existingAlert = alert.get();
			existingAlert.setActive(true);
			alertService.updateAlert(id, existingAlert);
			return ResponseEntity.ok(existingAlert);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@PutMapping("/disableAlert/{id}")
	public ResponseEntity<Alert> disableAlert(@PathVariable Long id) {
		Optional<Alert> alert = alertService.getAlertById(id);
		if (alert.isPresent()) {
			Alert existingAlert = alert.get();
			existingAlert.setActive(false);
			alertService.updateAlert(id, existingAlert);
			return ResponseEntity.ok(existingAlert);
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}
}
