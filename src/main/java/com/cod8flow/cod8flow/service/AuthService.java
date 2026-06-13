package com.cod8flow.cod8flow.service;

import com.cod8flow.cod8flow.dto.request.LoginRequest;
import com.cod8flow.cod8flow.dto.request.RefreshRequest;
import com.cod8flow.cod8flow.dto.request.RegisterRequest;
import com.cod8flow.cod8flow.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshRequest request);
}
