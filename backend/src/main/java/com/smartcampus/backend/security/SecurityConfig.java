package com.smartcampus.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.crypto.password.NoOpPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;

import com.smartcampus.backend.service.OAuth2UserServiceImpl;

import jakarta.servlet.http.HttpServletResponse;

@Configuration(proxyBeanMethods = false)
public class SecurityConfig {

    private final OAuth2UserServiceImpl customOidcUserService;

    public SecurityConfig(OAuth2UserServiceImpl customOidcUserService) {
        this.customOidcUserService = customOidcUserService;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/", "/error").permitAll()
                        .requestMatchers("/oauth2/**").permitAll()
                        // Swagger UI endpoints
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll()

                        .requestMatchers("/api/**").permitAll()
                        .requestMatchers("/api/resources/**").hasRole("ADMIN")
                        .requestMatchers("/api/bookings/**").hasAnyRole("USER", "ADMIN")
                        .anyRequest().authenticated())

                // Return JSON for 401 and 403 errors
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint(customAuthenticationEntryPoint())
                        .accessDeniedHandler(customAccessDeniedHandler()))

                .oauth2Login(oauth -> oauth
                        .userInfoEndpoint(userInfo -> userInfo
                                .oidcUserService(customOidcUserService))
                        // Redirect to frontend with username upon successful login
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
    public AccessDeniedHandler customAccessDeniedHandler() {
        return (request, response, accessDeniedException) -> {
            response.setContentType("application/json");
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.getWriter().write(
                    "{\"error\": \"Forbidden\", \"message\": \"You do not have permission to access this resource.\"}");
        };
    }

    @Bean
    public AuthenticationSuccessHandler customSuccessHandler() {
        return (request, response, authentication) -> {
            String userEmail = authentication.getName();
            response.sendRedirect("http://localhost:5173?username=" + userEmail);
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return NoOpPasswordEncoder.getInstance();
    }
}