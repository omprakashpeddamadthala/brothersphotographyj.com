package com.brothersphotography.service;

import com.brothersphotography.dto.AuthRequest;
import com.brothersphotography.dto.AuthResponse;
import com.brothersphotography.entity.Role;
import com.brothersphotography.entity.User;
import com.brothersphotography.repository.UserRepository;
import com.brothersphotography.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    @Value("${app.admin.initial-email:admin@brothersphotographyj.com}")
    private String adminEmail;

    @Value("${app.admin.initial-password:Admin@123456}")
    private String adminPassword;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void bootstrapAdminUser() {
        if (!userRepository.existsByEmail(adminEmail)) {
            log.info("Bootstrapping initial ADMIN user: {}", adminEmail);
            User admin = User.builder()
                    .email(adminEmail)
                    .password(passwordEncoder.encode(adminPassword))
                    .name("Super Admin")
                    .provider("LOCAL")
                    .role(Role.ROLE_ADMIN)
                    .active(true)
                    .build();
            userRepository.save(admin);
            log.info("Admin user created successfully.");
        }
    }

    public AuthResponse login(AuthRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = tokenProvider.generateToken(authentication);

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    @Transactional
    public AuthResponse processOAuth2GoogleLogin(String email, String name, String avatarUrl, String googleId) {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            log.info("Creating new user via Google OAuth2: {}", email);
            User newUser = User.builder()
                    .email(email)
                    .name(name)
                    .avatarUrl(avatarUrl)
                    .provider("GOOGLE")
                    .providerId(googleId)
                    .role(email.equalsIgnoreCase(adminEmail) ? Role.ROLE_ADMIN : Role.ROLE_USER)
                    .active(true)
                    .build();
            return userRepository.save(newUser);
        });

        String token = tokenProvider.generateTokenFromEmail(user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .tokenType("Bearer")
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole().name())
                .avatarUrl(user.getAvatarUrl())
                .build();
    }
}
