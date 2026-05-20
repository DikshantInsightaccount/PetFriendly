package com.spring.ApiGateway.client;

import com.spring.ApiGateway.util.ResponseMessage;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import org.springframework.http.HttpHeaders;
//import java.net.http.HttpHeaders;
import java.util.Map;

@Component
public class AuthServiceClient {

    private final WebClient webClient;

    public AuthServiceClient(WebClient.Builder builder) {
        this.webClient = builder.build();
    }



    public Mono<Map<String, Object>> validateToken(String token) {
        return webClient.post()
                .uri("lb://AUTH-SERVICE/auth/validate")
                .header(HttpHeaders.AUTHORIZATION, token)
                .header(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .retrieve()
                .bodyToMono(new ParameterizedTypeReference<ResponseMessage<Map<String, Object>>>() {})
                .map(ResponseMessage::getData);
    }
}