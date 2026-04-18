package com.smartcampus.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.smartcampus.backend.service.CustomUserDetailsService;

@Configuration
public class SecurityConfig {

    @Bean
public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

    http
        .csrf(csrf -> csrf.disable())
        .authorizeHttpRequests(auth -> auth
            .requestMatchers("/api/resources/**").hasRole("ADMIN")
            .requestMatchers("/api/bookings/**").hasAnyRole("USER", "ADMIN")
            .anyRequest().authenticated()
        )
        .httpBasic();

    return http.build();
}


    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}