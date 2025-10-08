package com.example.backend_pfe.services;

import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.example.backend_pfe.entities.Alert;
import com.example.backend_pfe.repositories.AlertRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import java.util.List;
import java.util.Map;


@Service
@EnableScheduling
public class FutureService {
	
	
	@Autowired
	private AlertService alertService;
	
	
	@Autowired
	private AlertRepository alertRepository;

    private final String apiUrl = "https://be.laevitas.ch/pfe/futures";
    private final String secret = "AS845fsd,asd//6";
  
    @Scheduled(fixedDelay = 60000)
    public void fetchDataFromApi() {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.set("secret", secret);

        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(apiUrl, HttpMethod.GET, entity, String.class);

        if (response.getStatusCode().is2xxSuccessful()) {
            System.out.println("Data fetched successfully!");
            List<Map<String, Object>> data = alertService.parseAndFlattenData(response.getBody());
            if (data != null) {
                Map<Alert, Map<String, List<Map<String, Object>>>> matchingEntriesByAlert = alertService.evaluateAlerts(data);
                for (Map.Entry<Alert, Map<String, List<Map<String, Object>>>> alertEntry : matchingEntriesByAlert.entrySet()) {
                    Alert alert = alertEntry.getKey();
                    Map<String, List<Map<String, Object>>> matchingEntriesByTicker = alertEntry.getValue();
                    if (!matchingEntriesByTicker.isEmpty()) {
                        System.out.println("Triggered tickers for \"" + alert.getName() + "\":");
                        for (Map.Entry<String, List<Map<String, Object>>> tickerEntry : matchingEntriesByTicker.entrySet()) {
                            System.out.println("Ticker: " + tickerEntry.getKey() + ", Matching Entries: " + tickerEntry.getValue().size());
                        }
                    } else {
                        System.out.println("No matching entries found for alert \"" + alert.getName() + "\".");
                    }
                }
            }
        } else {
            System.out.println("Failed to fetch data. Status code: " + response.getStatusCode());
        }
    }


    public List<List<Map<String, Object>>> fetchFutureDataFromApi() {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("secret", "AS845fsd,asd//6");

            HttpEntity<String> entity = new HttpEntity<>(headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<List<List<Map<String, Object>>>> responseEntity = restTemplate.exchange(
                    apiUrl,
                    HttpMethod.GET,
                    entity,
                    new ParameterizedTypeReference<List<List<Map<String, Object>>>>() {}
            );

            System.out.println("API connection successful");

            return responseEntity.getBody();
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch data from API", e);
        }
    }

 
}



