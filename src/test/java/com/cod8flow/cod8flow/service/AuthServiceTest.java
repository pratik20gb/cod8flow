package com.cod8flow.cod8flow.service;

import com.cod8flow.cod8flow.domain.entity.User;
import com.cod8flow.cod8flow.domain.enums.Role;
import com.cod8flow.cod8flow.dto.request.LoginRequest;
import com.cod8flow.cod8flow.dto.request.RegisterRequest;
import com.cod8flow.cod8flow.dto.response.AuthResponse;
import com.cod8flow.cod8flow.repository.UserRepository;
import com.cod8flow.cod8flow.security.JwtService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtService jwtService;
    @Mock private AuthenticationManager authenticationManager;

    @InjectMocks private AuthService authService;

    private static final String EMAIL = "alice@example.com";
    private static final String RAW_PASSWORD = "secret123";
    private static final String ENCODED_PASSWORD = "encoded-secret";

    private User buildUser() {
        return User.builder()
                .id(UUID.randomUUID())
                .firstName("Alice")
                .lastName("Smith")
                .email(EMAIL)
                .password(ENCODED_PASSWORD)
                .role(Role.MEMBER)
                .isActive(true)
                .build();
    }

    // ─── register ────────────────────────────────────────────────────────────

    @Test
    void register_success_returnsTokensAndUserInfo() {
        RegisterRequest request = RegisterRequest.builder()
                .firstName("Alice")
                .lastName("Smith")
                .email(EMAIL)
                .password(RAW_PASSWORD)
                .build();

        when(userRepository.existsByEmail(EMAIL)).thenReturn(false);
        when(passwordEncoder.encode(RAW_PASSWORD)).thenReturn(ENCODED_PASSWORD);
        when(jwtService.generateAccessToken(EMAIL, "MEMBER")).thenReturn("access-token");
        when(jwtService.generateRefreshToken(EMAIL)).thenReturn("refresh-token");

        AuthResponse response = authService.register(request);

        assertThat(response.getEmail()).isEqualTo(EMAIL);
        assertThat(response.getRole()).isEqualTo("MEMBER");
        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_duplicateEmail_throwsRuntimeException() {
        RegisterRequest request = RegisterRequest.builder()
                .firstName("Alice")
                .lastName("Smith")
                .email(EMAIL)
                .password(RAW_PASSWORD)
                .build();

        when(userRepository.existsByEmail(EMAIL)).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email already exists");

        verify(userRepository, never()).save(any());
    }

    // ─── login ───────────────────────────────────────────────────────────────

    @Test
    void login_success_returnsTokensAndUserInfo() {
        LoginRequest request = LoginRequest.builder()
                .email(EMAIL)
                .password(RAW_PASSWORD)
                .build();
        User user = buildUser();

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(jwtService.generateAccessToken(EMAIL, "MEMBER")).thenReturn("access-token");
        when(jwtService.generateRefreshToken(EMAIL)).thenReturn("refresh-token");

        AuthResponse response = authService.login(request);

        assertThat(response.getEmail()).isEqualTo(EMAIL);
        assertThat(response.getRole()).isEqualTo("MEMBER");
        assertThat(response.getAccessToken()).isEqualTo("access-token");
        assertThat(response.getRefreshToken()).isEqualTo("refresh-token");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }

    @Test
    void login_userNotFound_throwsRuntimeException() {
        LoginRequest request = LoginRequest.builder()
                .email(EMAIL)
                .password(RAW_PASSWORD)
                .build();

        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    // ─── refresh ─────────────────────────────────────────────────────────────

    @Test
    void refresh_validToken_returnsNewAccessToken() {
        String refreshToken = "valid-refresh-token";
        User user = buildUser();

        when(jwtService.extractEmail(refreshToken)).thenReturn(EMAIL);
        when(jwtService.isTokenExpired(refreshToken)).thenReturn(false);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.of(user));
        when(jwtService.generateAccessToken(EMAIL, "MEMBER")).thenReturn("new-access-token");

        AuthResponse response = authService.refresh(refreshToken);

        assertThat(response.getAccessToken()).isEqualTo("new-access-token");
        assertThat(response.getRefreshToken()).isEqualTo(refreshToken);
        assertThat(response.getEmail()).isEqualTo(EMAIL);
    }

    @Test
    void refresh_expiredToken_throwsRuntimeException() {
        String refreshToken = "expired-token";

        when(jwtService.extractEmail(refreshToken)).thenReturn(EMAIL);
        when(jwtService.isTokenExpired(refreshToken)).thenReturn(true);

        assertThatThrownBy(() -> authService.refresh(refreshToken))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Refresh token expired");
    }

    @Test
    void refresh_userNotFound_throwsRuntimeException() {
        String refreshToken = "valid-refresh-token";

        when(jwtService.extractEmail(refreshToken)).thenReturn(EMAIL);
        when(jwtService.isTokenExpired(refreshToken)).thenReturn(false);
        when(userRepository.findByEmail(EMAIL)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.refresh(refreshToken))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }
}
