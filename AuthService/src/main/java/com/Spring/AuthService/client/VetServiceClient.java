package com.Spring.AuthService.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class VetServiceClient {

    private final RestTemplate restTemplate;

    @Value("${vet.service.url}")
    private String vetServiceUrl;

    public VetServiceClient(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public void createVetProfile(Long userId) {
        String url = vetServiceUrl + "/vets?userId=" + userId;
        restTemplate.postForEntity(url, null, Void.class);
    }
}