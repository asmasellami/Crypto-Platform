package com.example.backend_pfe.services;


import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONObject;
import org.json.JSONArray;

@Service
public class CryptoApiService {
    private final RestTemplate restTemplate;

    public CryptoApiService() {
        this.restTemplate = new RestTemplate();
    }

    public String fetchCryptoData(String url) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("secret", "AS845fsd,asd//6");
        HttpEntity<String> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);
            return response.getBody();
        } catch (Exception e) {
            System.out.println("Failed to fetch data: " + e.getMessage());
            return null;
        }
    }

    public Map<String, Map<String, Double>> fetchLatestData() {
        Map<String, Map<String, Double>> results = new HashMap<>();
   
        String optionsUrl = "https://be.laevitas.ch/pfe/options";
        String futuresUrl = "https://be.laevitas.ch/pfe/futures";
        String perpetualsUrl = "https://be.laevitas.ch/pfe/perpetuals";
      

        addToResults(results, fetchCryptoData(optionsUrl));
        addToResults(results, fetchCryptoData(futuresUrl));
        addToResults(results, fetchCryptoData(perpetualsUrl));
        
      

        return results;
    }

    private void addToResults(Map<String, Map<String, Double>> results, String data) {
        if (data != null) {
            JSONArray jsonArray = new JSONArray(data);
            for (int i = 0; i < jsonArray.length(); i++) {
                JSONArray innerArray = jsonArray.getJSONArray(i);
                parseDataEntry(results, innerArray);
            }
        }
    }

 
    
    private void parseDataEntry(Map<String, Map<String, Double>> results, JSONArray dataEntry) {
        String identifier = null; 
        Map<String, Double> metrics = new HashMap<>();

        for (int i = 0; i < dataEntry.length(); i++) {
            JSONObject jsonObject = dataEntry.getJSONObject(i);
            String name = jsonObject.getString("name");
            
            if ("ticker".equals(name) || "currency".equals(name)) {
                identifier = jsonObject.getString("value");
            } else {
                double value = jsonObject.optDouble("value", Double.NaN);
                if (!Double.isNaN(value)) {
                    metrics.put(name, value);
                }
            }
        }

        if (identifier != null && !metrics.isEmpty()) {
            results.put(identifier, metrics);
        }
    }

    
    
    }
