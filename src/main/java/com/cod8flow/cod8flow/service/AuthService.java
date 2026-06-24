package com.cod8flow.cod8flow.service;


import com.cod8flow.cod8flow.domain.entity.User;
import com.cod8flow.cod8flow.domain.enums.Role;
import com.cod8flow.cod8flow.dto.request.GoogleAuthRequest;
import com.cod8flow.cod8flow.dto.request.LoginRequest;
import com.cod8flow.cod8flow.dto.request.RegisterRequest;
import com.cod8flow.cod8flow.dto.response.AuthResponse;
import com.cod8flow.cod8flow.repository.UserRepository;
import com.cod8flow.cod8flow.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${GOOGLE_CLIENT_ID:}")
    private String googleClientId;


    public AuthResponse register(RegisterRequest request) {
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        User user = User.builder().
                firstName(request.getFirstName()).
                lastName(request.getLastName()).
                email(request.getEmail()).
                password(passwordEncoder.encode(request.getPassword())).
                role(Role.MEMBER).
                isActive(true).
                build();

        userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );

        String refreshToken = jwtService.generateRefreshToken(
                user.getEmail()
        );

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(()->new RuntimeException("User not found"));

        String  accessToken = jwtService.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );
        String refreshToken = jwtService.generateRefreshToken(
                user.getEmail()
        );

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
    @SuppressWarnings("unchecked")
    public AuthResponse googleLogin(GoogleAuthRequest request) {
        // Fetch user info using the Google OAuth2 access token
        Map<String, Object> userInfo;
        try {
            userInfo = RestClient.create()
                    .get()
                    .uri("https://www.googleapis.com/oauth2/v3/userinfo")
                    .header("Authorization", "Bearer " + request.getIdToken())
                    .retrieve()
                    .body(Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Invalid Google token");
        }

        if (userInfo == null || userInfo.get("email") == null) {
            throw new RuntimeException("Google token did not return an email");
        }

        String email = (String) userInfo.get("email");
        String firstName = (String) userInfo.getOrDefault("given_name", "Google");
        String lastName = (String) userInfo.getOrDefault("family_name", "User");

        User user = userRepository.findByEmail(email).orElseGet(() ->  {
            User newUser = User.builder()
                    .email(email)
                    .firstName(firstName)
                    .lastName(lastName)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .role(Role.MEMBER)
                    .isActive(true)
                    .build();
            return userRepository.save(newUser);
        });

        String accessToken = jwtService.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    public AuthResponse refresh(String refreshToken) {
        String email = jwtService.extractEmail(refreshToken);
        if(jwtService.isTokenExpired(refreshToken)) {
            throw new RuntimeException("Refresh token expired");
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(()->new RuntimeException("User not found"));

        String newAccessToken = jwtService.generateAccessToken(
                user.getEmail(),
                user.getRole().name()
        );

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

}
