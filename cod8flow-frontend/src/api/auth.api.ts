import api from './client';
import type { AuthResponse, LoginRequest, RegisterRequest } from '../types';

export const register = (data: RegisterRequest) =>
  api.post<AuthResponse>('/auth/register', data);

export const login = (data: LoginRequest) =>
  api.post<AuthResponse>('/auth/login', data);

export const refresh = (refreshToken: string) =>
  api.post<AuthResponse>('/auth/refresh', {}, {
    headers: { Authorization: `Bearer ${refreshToken}` },
  });
