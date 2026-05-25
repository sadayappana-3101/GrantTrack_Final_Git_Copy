import { UserRole } from './enums';

export interface LoginRequest {
  email: string;
  password: string;
}

export type LoginResponse = string;

export interface JwtClaims {
  sub: string;            // user id (as string)
  email: string;
  role: UserRole;         // serialized via ClaimTypes.Role
  jti: string;
  exp: number;            // unix seconds
  iat?: number;
  aud?: string;
  iss?: string;
}

export interface CurrentUser {
  userId: number;
  email: string;
  role: UserRole;
  exp: number;            // unix seconds — for client-side expiry checks
}

export interface RegisterUserRequest {
  name: string;
  email: string;
  password: string;
  phone: string;          // exactly 10 digits — RegisterUserDto regex
  role?: UserRole | null; // backend defaults to Applicant when omitted
}

export interface ForgotPasswordRequest {
  email: string;
  newPassword: string;
  confirmPassword: string;
}
