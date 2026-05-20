package com.springboot.VetService.config;

import org.junit.jupiter.api.Test;
import org.springframework.web.client.RestTemplate;

import static org.junit.jupiter.api.Assertions.*;

class ConfigCoverageTest {

    @Test
    void testRestTemplateBean() {

        RestTemplateConfig config =
                new RestTemplateConfig();

        RestTemplate restTemplate =
                config.restTemplate();

        assertNotNull(restTemplate);
    }
}