package com.example.backend_pfe.services;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import com.example.backend_pfe.entities.Notification;
import com.example.backend_pfe.repositories.NotificationRepository;
import com.example.backend_pfe.repositories.UserRepository;
import com.example.backend_pfe.security.JWTAuthenticationFilter;



@Service
public class GlobalDataService {
    private final CryptoApiService cryptoApiService;
    private final NotificationService notificationService;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;
    
   
    @Autowired
    public GlobalDataService(CryptoApiService cryptoApiService,NotificationService notificationService) {
        this.cryptoApiService = cryptoApiService;
        this.notificationService=notificationService;
    }

    @Scheduled(fixedRate = 10000)
    public void fetchData() {
 
        String optionsData = cryptoApiService.fetchCryptoData("https://be.laevitas.ch/pfe/options");
        String futuresData = cryptoApiService.fetchCryptoData("https://be.laevitas.ch/pfe/futures");
        String perpetualsData = cryptoApiService.fetchCryptoData("https://be.laevitas.ch/pfe/perpetuals");

        messagingTemplate.convertAndSend("/topic/options", optionsData);
        messagingTemplate.convertAndSend("/topic/futures", futuresData);  
        messagingTemplate.convertAndSend("/topic/perpetuals", perpetualsData);
   
    }
   
    
    private final Map<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();
    
    public void registerUserSession(String userId, WebSocketSession session) {
        userSessions.put(userId, session);
    }
    
    public void sendPrivateMessage(String userId, String message) throws IOException {
        WebSocketSession userSession = userSessions.get(userId);
        if (userSession != null && userSession.isOpen()) {
            TextMessage textMessage = new TextMessage(message);
            userSession.sendMessage(textMessage);
        } else {
            
        }
    }
    
    private static final Logger logger = LoggerFactory.getLogger(GlobalDataService.class);
    
}
