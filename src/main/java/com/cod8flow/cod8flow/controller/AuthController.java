package com.cod8flow.cod8flow.controller;


import com.cod8flow.cod8flow.dto.request.GoogleAuthRequest;
import com.cod8flow.cod8flow.dto.request.LoginRequest;
import com.cod8flow.cod8flow.dto.request.RegisterRequest;
import com.cod8flow.cod8flow.dto.response.AuthResponse;
import com.cod8flow.cod8flow.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;


    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest registerRequest
    ) {
        return ResponseEntity.status(HttpStatus.CREATED).body(authService.register(registerRequest));

    }


    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest loginRequest
    )
    {
        return ResponseEntity.ok(authService.login(loginRequest));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(
            @RequestBody GoogleAuthRequest request
    ) {
        return ResponseEntity.ok(authService.googleLogin(request));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(
            @RequestHeader("Authorization")String authHeader
    ){
        String refreshToken = authHeader.substring(7);
        return ResponseEntity.ok(authService.refresh(refreshToken));
    }
}
