package com.cod8flow.cod8flow.service;

import com.cod8flow.cod8flow.domain.entity.RefreshToken;
import com.cod8flow.cod8flow.domain.entity.User;
import com.cod8flow.cod8flow.domain.enums.Role;
import com.cod8flow.cod8flow.dto.request.LoginRequest;
import com.cod8flow.cod8flow.dto.request.RefreshRequest;
import com.cod8flow.cod8flow.dto.request.RegisterRequest;
import com.cod8flow.cod8flow.dto.response.AuthResponse;
import com.cod8flow.cod8flow.repository.RefreshTokenRepository;
import com.cod8flow.cod8flow.repository.UserRepository;
import com.cod8flow.cod8flow.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already in use");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .role(Role.MEMBER)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        String accessToken = jwtService.generateAccessToken(savedUser.getEmail(), savedUser.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(savedUser.getEmail());

        // Persist refresh token (simple rotation strategy: store latest)
        saveRefreshToken(savedUser, refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(savedUser.getEmail())
                .role(savedUser.getRole().name())
                .build();
    }

    @Override
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // After successful auth, load user for role
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String accessToken = jwtService.generateAccessToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());

        saveRefreshToken(user, refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshRequest request) {
        String requestToken = request.getRefreshToken();

        RefreshToken storedToken = refreshTokenRepository.findByToken(requestToken)
                .orElseThrow(() -> new RuntimeException("Invalid refresh token"));

        if (storedToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(storedToken);
            throw new RuntimeException("Refresh token expired");
        }

        User user = storedToken.getUser();

        // Optional: rotate refresh token for better security
        String newAccessToken = jwtService.generateAccessToken(user.getEmail(), user.getRole().name());
        String newRefreshToken = jwtService.generateRefreshToken(user.getEmail());

        // Update stored token
        storedToken.setToken(newRefreshToken);
        storedToken.setExpiresAt(LocalDateTime.now().plusSeconds(604800)); // 7 days
        refreshTokenRepository.save(storedToken);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    private void saveRefreshToken(User user, String token) {
        // Simple approach: delete previous for this user then save new
        refreshTokenRepository.deleteByUserId(user.getId());

        RefreshToken refreshTokenEntity = RefreshToken.builder()
                .token(token)
                .user(user)
                .expiresAt(LocalDateTime.now().plusSeconds(604800)) // 7 days in seconds
                .createdAt(LocalDateTime.now())
                .build();

        refreshTokenRepository.save(refreshTokenEntity);
    }
}
