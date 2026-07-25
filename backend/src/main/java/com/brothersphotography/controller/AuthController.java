package com.brothersphotography.controller;

import com.brothersphotography.dto.ApiResponse;
import com.brothersphotography.dto.AuthRequest;
import com.brothersphotography.dto.AuthResponse;
import com.brothersphotography.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Endpoints for Admin and User Login via JWT and Google OAuth2")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Admin & User Login via email & password")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.success(response, "Login successful"));
    }

    @PostMapping("/google")
    @Operation(summary = "Google OAuth2 Login token exchange")
    public ResponseEntity<ApiResponse<AuthResponse>> googleLogin(
            @RequestParam String email,
            @RequestParam String name,
            @RequestParam(required = false) String avatarUrl,
            @RequestParam(required = false) String googleId) {
        AuthResponse response = authService.processOAuth2GoogleLogin(email, name, avatarUrl, googleId);
        return ResponseEntity.ok(ApiResponse.success(response, "Google login successful"));
    }
}
