package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Collections;
import java.util.List;

@Service
public class OAuth2UserServiceImpl extends OidcUserService {

    private static final Logger logger = LoggerFactory.getLogger(OAuth2UserServiceImpl.class);

    @Autowired
    private UserRepository userRepository;

    @Override
    public OidcUser loadUser(OidcUserRequest userRequest) {
        OidcUser oidcUser = super.loadUser(userRequest);
        
        String email = oidcUser.getEmail();
        
        if (!StringUtils.hasText(email)) {
            throw new IllegalArgumentException("Email is required for OAuth2 login but was not provided");
        }
        
        logger.info("OAuth2 login attempt for email: {}", email);
        
        // Always fetch fresh user data from database
        User user = userRepository.findByUsername(email).orElse(null);
        
        if (user == null) {
            logger.info("Creating new user for email: {}", email);
            user = new User();
            user.setUsername(email);
            user.setRole("USER");
            user.setPassword(""); // OAuth2 users don't have passwords
            userRepository.save(user);
        } else {
            logger.info("Found existing user for email: {}, role: {}", email, user.getRole());
        }
        
        // Always use the latest role from database
        String role = user.getRole();
        logger.info("Assigning role {} to user {}", role, email);
        
        List<SimpleGrantedAuthority> authorities = Collections.singletonList(
            new SimpleGrantedAuthority("ROLE_" + role)
        );
        
        DefaultOidcUser result = new DefaultOidcUser(authorities, oidcUser.getIdToken(), oidcUser.getUserInfo(), "email");
        
        logger.info("OAuth2 user created with email: {}, authorities: {}", result.getEmail(), result.getAuthorities());
        
        return result;
    }
}