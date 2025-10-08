package com.example.backend_pfe.services;


import java.util.Collections;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.backend_pfe.entities.Notification;
import com.example.backend_pfe.entities.ResetToken;
import com.example.backend_pfe.entities.User;
import com.example.backend_pfe.repositories.AlertRepository;
import com.example.backend_pfe.repositories.NotificationRepository;
import com.example.backend_pfe.repositories.UserRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;



@Service
public class NotificationService {
	
	@Autowired
	NotificationRepository notificationRepository;
	
	@Autowired
	AlertRepository alertRepository;
	
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	AlertService alertService;
	
	@Autowired
	UserService userService;
	
	@Autowired
	JavaMailSender javaMailSender;
	
	
	
	public List<Notification> getNotificationsForCurrentUser() {
	    Long currentUserId = userService.getCurrentUserId();
	    if (currentUserId == null) {
	        return Collections.emptyList();
	    }
	    
	    List<Notification> notifications = notificationRepository.findByUserId(currentUserId);
	    System.out.println(notifications);
	    return notifications;
	}
	
	
    public User getUserForNotif(Notification notif) {
        return userRepository.findByUsername(notif.getUsername());
    }
    
    public List<Notification> getNotifUser(Long userId) {
        return notificationRepository.findByUserId(userId);
    }

    public void updateNotification(Notification notification) {
        notificationRepository.save(notification);
    }
    
    public void markAllNotificationsAsViewed(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        for (Notification notification : notifications) {
            notification.setViewed(true);
        }
        notificationRepository.saveAll(notifications);
    }
 
	    
   
	public void envoyer(ResetToken validation) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setFrom("hamdiamal145@gmail.com");
            helper.setTo(validation.getUtilisateur().getEmail());
            helper.setSubject("Your Password Reset Code");

            String htmlMsg = String.format(
                    "<div style='font-family: Arial, sans-serif; font-size: 14px; color: #333;'>"
                    + "<h2 style='color: #4CAF50;'>Hello %s,</h2>"
                    + "<p>Your password reset code is:</p>"
                    + "<div style='font-size: 18px; font-weight: bold; color: #E91E63;'>%s</div>"
                    + "<p>Please use this code to reset your password.</p>"
                    + "<br/>"
                    + "<p>Best regards,</p>"
                    + "<p>The Team</p>"
                    + "</div>",
                    validation.getUtilisateur().getUsername(),
                    validation.getCode()
            );

            helper.setText(htmlMsg, true);
            javaMailSender.send(mimeMessage);
        } catch (MessagingException e) {
            System.err.println("Failed to send email: " + e.getMessage());
         
        }
    }

    
	

}
