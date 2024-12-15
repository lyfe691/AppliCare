package com.applicare.applicare.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

/**
 * this class makes life easier.
 */

@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors().and().csrf().disable()
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/api/status", "/api/test-mongo").permitAll() // Allow public access
                .anyRequest().authenticated()
            )
            .formLogin().disable()
            .httpBasic().disable();
    
        return http.build();
    }
    
}
