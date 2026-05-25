import { UserRole } from './enums';

export interface ViewUser {
  userId: number;
  name: string | null;
  email: string | null;
  status: boolean;
  role: string | null;
}

export interface UpdateUserRequest {
  name?: string | null;
  phone?: string | null;
  role?: UserRole | string | null;
  status: boolean;
  email?: string | null;
}

export interface UpdateUserResponse {
  name: string | null;
  role: string | null;
  phone: string | null;
  status: boolean;
  email: string | null;
}
