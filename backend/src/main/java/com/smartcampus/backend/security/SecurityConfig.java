package com.smartcampus.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.smartcampus.backend.service.OAuth2UserServiceImpl;

@Configuration
public class SecurityConfig {

    private final OAuth2UserServiceImpl oAuth2UserServiceImpl;

    public SecurityConfig(OAuth2UserServiceImpl oAuth2UserServiceImpl) {
        this.oAuth2UserServiceImpl = oAuth2UserServiceImpl;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
            .csrf(csrf -> csrf.disable())

            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/error").permitAll()
                .requestMatchers("/oauth2/**").permitAll()
                .requestMatchers("/api/resources/**").hasRole("ADMIN")
                .requestMatchers("/api/bookings/**").hasAnyRole("USER", "ADMIN")
                .anyRequest().authenticated()
            )

            .oauth2Login(oauth -> oauth
                .userInfoEndpoint(userInfo -> userInfo
                    .oidcUserService(oAuth2UserServiceImpl)
                )
                // 🔥 THIS IS THE ONLY ADDITION
                .defaultSuccessUrl("/api/bookings", true)
            )

            .formLogin(form -> form.disable())
            .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}