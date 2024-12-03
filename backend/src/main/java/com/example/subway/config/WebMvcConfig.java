package com.example.subway.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry){
        registry.addMapping("/**")
                .allowedOrigins("*") // 모든 도메인 허용
                .allowedHeaders("*")
                //.allowedOrigins("http://localhost:8081", "https://248a-202-30-111-171.ngrok-free.app")
                .allowedMethods("*");
    }
}