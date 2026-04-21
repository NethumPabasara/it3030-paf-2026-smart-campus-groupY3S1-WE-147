package com.smartcampus.backend.service;

import com.smartcampus.backend.entity.User;
import com.smartcampus.backend.repository.UserRepository;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserRequest;
import org.springframework.security.oauth2.client.oidc.userinfo.OidcUserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.oidc.user.DefaultOidcUser;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import java.util.Collections;

@Service
public class OAuth2UserServiceImpl extends OidcUserService {

    private final UserRepository userRepository;

    public OAuth2UserServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public OidcUser loadUser(OidcUserRequest userRequest)
        throws OAuth2AuthenticationException {

    OidcUser oAuth2User = super.loadUser(userRequest);

    Map<String, Object> attributes = oAuth2User.getAttributes();

    String email = oAuth2User.getAttribute("email");
    if (email == null) {
        throw new OAuth2AuthenticationException("Email not found from Google");
    }

    System.out.println("🔥 OAuth2UserServiceImpl CALLED: " + email);

    User user = userRepository.findByUsername(email)
            .orElseGet(() -> {
                User newUser = new User();
                newUser.setUsername(email);
                newUser.setPassword("");
                newUser.setRole("USER");
                return userRepository.save(newUser);
            });

    return new DefaultOidcUser(
        Collections.singletonList(
                new SimpleGrantedAuthority("ROLE_" + user.getRole().toUpperCase())
        ),
        oAuth2User.getIdToken(),
        oAuth2User.getUserInfo(),
        "email"
    );
}
}