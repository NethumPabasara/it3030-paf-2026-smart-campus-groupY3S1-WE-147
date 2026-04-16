package com.smartcampus.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

// 🔥 ADD THESE IMPORTS
import org.springframework.security.core.userdetails.*;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.core.userdetails.User;

@Configuration
public class SecurityConfig {

    // 🔒 SECURITY RULES
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .anyRequest().authenticated()
            )
            .httpBasic();

        return http.build();
    }

    // 🔥 ADD THIS METHOD (VERY IMPORTANT)
    @Bean
    public UserDetailsService userDetailsService() {

        UserDetails admin = User
                .withUsername("admin")
                .password("{noop}1234")
                .roles("ADMIN")
                .build();

        UserDetails user = User
                .withUsername("user")
                .password("{noop}1234")
                .roles("USER")
                .build();

        return new InMemoryUserDetailsManager(admin, user);
    }
}