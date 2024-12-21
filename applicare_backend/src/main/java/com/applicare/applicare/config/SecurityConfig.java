package com.applicare.applicare.config;

import com.applicare.applicare.util.JwtUtil;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManagerResolver;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // If you want to skip authentication for certain endpoints:
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Permit all requests to auth endpoints
                .requestMatchers("/api/auth/**").permitAll()
                // For demonstration, let other endpoints be open or .authenticated()
                .requestMatchers(HttpMethod.GET, "/api/test-mongo").permitAll()
                // everything else requires a login token
                //.anyRequest().authenticated()
                .anyRequest().permitAll() // or .authenticated()
            )
            // We are not configuring a real userDetailsService for now
            .httpBasic(Customizer.withDefaults())
            .formLogin(Customizer.withDefaults());

        return http.build();
    }


}
