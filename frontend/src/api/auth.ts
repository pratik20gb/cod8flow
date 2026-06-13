import { http } from "./http";

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export async function login(payload: LoginRequest) {
  const response = await http.post<AuthResponse>("/api/v1/auth/login", payload);
  return response.data;
}

export async function register(payload: RegisterRequest) {
  const response = await http.post<AuthResponse>("/api/v1/auth/register", payload);
  return response.data;
}
