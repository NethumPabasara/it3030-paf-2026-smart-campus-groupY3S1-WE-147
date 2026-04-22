package com.smartcampus.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.smartcampus.backend.service.OAuth2UserServiceImpl;

import jakarta.servlet.http.HttpServletResponse;

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
                        .anyRequest().authenticated())

                // Return 401 JSON for unauthenticated requests instead of redirecting
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(customAuthenticationEntryPoint()))

                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo
                                .oidcUserService(oAuth2UserServiceImpl))
                        // Return JSON upon successful login instead of redirecting
                        .successHandler(customSuccessHandler()))

                .formLogin(form -> form.disable())
                .httpBasic(httpBasic -> httpBasic.disable());

        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint customAuthenticationEntryPoint() {
        return (request, response, authException) -> {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write(
                    "{\"error\": \"Unauthorized\", \"message\": \"Authentication is required to access this resource.\"}");
        };
    }

    @Bean
    public AuthenticationSuccessHandler customSuccessHandler() {
        return (request, response, authentication) -> {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_OK);
            response.getWriter()
                    .write("{\"message\": \"Login successful\", \"username\": \"" + authentication.getName() + "\"}");
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}