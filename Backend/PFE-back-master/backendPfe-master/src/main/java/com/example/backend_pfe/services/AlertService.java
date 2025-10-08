package com.example.backend_pfe.services;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ScheduledFuture;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.backend_pfe.entities.Alert;
import com.example.backend_pfe.entities.Channel;
import com.example.backend_pfe.entities.Notification;
import com.example.backend_pfe.entities.User;
import com.example.backend_pfe.repositories.AlertRepository;
import com.example.backend_pfe.repositories.ChannelRepository;
import com.example.backend_pfe.repositories.NotificationRepository;
import com.example.backend_pfe.repositories.UserRepository;
import com.example.backend_pfe.util.AlertEmailSender;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.annotation.PostConstruct;

import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
public class AlertService {

    @Autowired
    private AlertRepository alertRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ChannelRepository channelRepository;

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private AlertEmailSender emailSender;

    @Autowired
    private TaskScheduler taskScheduler;

    private Map<Long, ScheduledFuture<?>> scheduledTasks = new ConcurrentHashMap<>();

    private final String apiUrl = "https://be.laevitas.ch/pfe/futures";
    private final String secret = "AS845fsd,asd//6";

    public List<Map<String, Object>> parseAndFlattenData(String jsonData) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            List<List<Map<String, Object>>> data = objectMapper.readValue(jsonData, new TypeReference<List<List<Map<String, Object>>>>() {});
            List<Map<String, Object>> flattenedData = new ArrayList<>();
            for (List<Map<String, Object>> entryList : data) {
                Map<String, Object> flattenedEntry = new HashMap<>();
                for (Map<String, Object> entry : entryList) {
                    flattenedEntry.put(entry.get("name").toString(), entry.get("value"));
                }
                flattenedData.add(flattenedEntry);
            }
            return flattenedData;
        } catch (IOException e) {
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

   
    
    public Map<Alert, Map<String, List<Map<String, Object>>>> evaluateAlerts(List<Map<String, Object>> data) {
        List<Alert> alerts = alertRepository.findAll();
        Map<Alert, Map<String, List<Map<String, Object>>>> matchingEntriesByAlert = new HashMap<>();

        for (Alert alert : alerts) {
            if (!alert.isActive()) {
                continue; 
            }

            Predicate<Map<String, Object>> condition = createCondition(alert);
            List<Map<String, Object>> matched = data.stream()
                    .filter(condition)
                    .collect(Collectors.toList());

            if (!matched.isEmpty()) {
                Map<String, List<Map<String, Object>>> matchingEntriesByTicker = new HashMap<>();
                for (Map<String, Object> match : matched) {
                    String ticker = (String) match.get("ticker");
                    matchingEntriesByTicker.computeIfAbsent(ticker, k -> new ArrayList<>()).add(match);
                }
                matchingEntriesByAlert.put(alert, matchingEntriesByTicker);

                User user = getUserForAlert(alert);
                if (user != null) {
                    LocalDateTime lastNotificationTime = getLastNotificationTime(alert.getId(), user.getUser_id());
                    long triggerFrequencyInMillis = convertFrequencyToMillis(alert.getTriggerFrequency());
                    if (lastNotificationTime == null || lastNotificationTime.plus(Duration.ofMillis(triggerFrequencyInMillis)).isBefore(LocalDateTime.now())) {
                        Notification notification = new Notification();
                        notification.setAlertId(alert.getId());
                        notification.setUsername(user.getUsername());
                        notification.setUserId(user.getUser_id());
                        notification.setCreatedAt(LocalDateTime.now());
                        
                        notification.setAlertName(alert.getName());             
                        notification.setAlertType(alert.getType());              
                        notification.setAlertFieldName(alert.getFieldName()); 
                        notification.setAlertoperator(alert.getOperator()); 
                        notification.setAlertthreshold(alert.getThreshold()); 
                        
                        notification.setMessage(matchingEntriesByTicker.size() + " tickers");

                        ObjectMapper objectMapper = new ObjectMapper();
                        try {
                            String tickerDetails = objectMapper.writeValueAsString(matchingEntriesByTicker);
                            notification.setTickerDetails(tickerDetails);
                        } catch (JsonProcessingException e) {
                            e.printStackTrace();
                        }

                        notificationRepository.save(notification);

                        sendEmailNotification(alert, user);
                    }
                }
            }
        }
        return matchingEntriesByAlert;
    }
    
 
   

    private void sendEmailNotification(Alert alert, User user) {
        List<Channel> channels = channelRepository.findByUserId(user.getUser_id());
        if (channels != null && !channels.isEmpty()) {
            for (Channel channel : channels) {
                if (alert.isEmailNotification() && channel.getEmail() != null && !channel.getEmail().isEmpty()) {
                   // String emailBody = "Hey " + user.getUsername() + ", your Alert " + alert.getFieldName() + " is triggered now.";
                	String emailBody = "Hey "+ user.getUsername()+ ", your Alert " + alert.getName() + " is triggered for table " +alert.getType()+" : "+alert.getFieldName();
                	try {
                        System.out.println("Sending email to: " + channel.getEmail());
                        emailSender.sendEmail(channel.getEmail(), emailBody);
                        System.out.println("Email sent to: " + channel.getEmail());
                    } catch (Exception e) {
                        System.err.println("Failed to send email to: " + channel.getEmail());
                        e.printStackTrace();
                    }
                }
            }
        }
    }

    public Predicate<Map<String, Object>> createCondition(Alert alert) {
        return entry -> {
            Object value = entry.get(alert.getFieldName());
            if (value instanceof Number) {
                double doubleValue = ((Number) value).doubleValue();
                switch (alert.getOperator()) {
                    case ">":
                        return doubleValue > alert.getThreshold();
                    case "<":
                        return doubleValue < alert.getThreshold();
                    case "=":
                        return doubleValue == alert.getThreshold();
                    case "!=":
                        return doubleValue != alert.getThreshold();
                    case ">=":
                        return doubleValue >= alert.getThreshold();
                    case "<=":
                        return doubleValue <= alert.getThreshold();
                    default:
                        return false;
                }
            }
            return false;
        };
    }


    
    public String fetchDataFromApi(String type) {
        String apiUrl = type.equals("futures") ? "https://be.laevitas.ch/pfe/futures" : "https://be.laevitas.ch/pfe/options";
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("secret", secret);
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, String.class);
        if (response.getStatusCode().is2xxSuccessful()) {
            System.out.println("Data fetched successfully from " + apiUrl);
            return response.getBody();
        } else {
            System.out.println("Failed to fetch data. Status code: " + response.getStatusCode());
            return null;
        }
    }



    @PostConstruct
    public void initializeAlerts() {
        List<Alert> alerts = alertRepository.findAll();
        for (Alert alert : alerts) {
            scheduleAlertTask(alert);
        }
    }


    private void scheduleAlertTask(Alert alert) {
        Runnable task = () -> {
            String dataString = fetchDataFromApi(alert.getType());  
            if (dataString != null) {
                List<Map<String, Object>> data = parseAndFlattenData(dataString);
                evaluateAlerts(data);
            }
        };

        long triggerFrequencyInMillis = convertFrequencyToMillis(alert.getTriggerFrequency());
        ScheduledFuture<?> scheduledTask = taskScheduler.scheduleWithFixedDelay(task, Duration.ofMillis(triggerFrequencyInMillis));
        scheduledTasks.put(alert.getId(), scheduledTask);
    }


  
    
    private long convertFrequencyToMillis(String frequency) {
        switch (frequency) {
            case "1min":
                return 60000; 
            case "5min":
                return 300000; 
            case "1h":
                return 3600000; 
            case "24h":
                return 86400000; 
            default:
                throw new IllegalArgumentException("Unsupported frequency: " + frequency);
        }
    }

    
    private LocalDateTime getLastNotificationTime(Long alertId, Long userId) {
        Notification lastNotification = notificationRepository.findTopByAlertIdAndUserIdOrderByCreatedAtDesc(alertId, userId);
        return lastNotification != null ? lastNotification.getCreatedAt() : null;
    }
    
    
    
    public List<Alert> getAlertsForCurrentUser(Long userId) {
        return alertRepository.findByUserId(userId);
    }

    public User getUserForAlert(Alert alert) {
        return userRepository.findById(alert.getUserId()).orElse(null);
    }
    
    public Optional<Alert> getAlertById(Long id) {
        return alertRepository.findById(id);
    }
    
    public Alert addAlert(Alert alert) {
        Alert savedAlert = alertRepository.save(alert);
        scheduleAlertTask(savedAlert);
        return savedAlert;
    }

    
    public Alert updateAlert(Long id, Alert updatedAlert) {
        Alert existingAlert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found with id: " + id));
        existingAlert.setFieldName(updatedAlert.getFieldName());
        existingAlert.setOperator(updatedAlert.getOperator());
        existingAlert.setThreshold(updatedAlert.getThreshold());
        existingAlert.setTriggerFrequency(updatedAlert.getTriggerFrequency());
        existingAlert.setEmailNotification(updatedAlert.isEmailNotification());
        existingAlert.setType(updatedAlert.getType());
        
        
        existingAlert.setActive(updatedAlert.isActive());

        Alert savedAlert = alertRepository.save(existingAlert);
        scheduleAlertTask(savedAlert);
        return savedAlert;
    }
    
    public void deleteAlert(long id) {
        alertRepository.deleteById(id);
    }
    

   
}