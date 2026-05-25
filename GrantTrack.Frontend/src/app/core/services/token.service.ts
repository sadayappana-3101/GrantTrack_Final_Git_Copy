import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { CurrentUser } from '../models/auth.models';
import { UserRole } from '../models/enums';

@Injectable({ providedIn: 'root' })
export class TokenService {
  private static readonly KEY = 'gt.token';

  private static readonly ROLE_CLAIM_KEYS = [
    'role',
    'roles',
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role',
  ];
  private static readonly USER_ID_CLAIM_KEYS = [
    'sub',
    'nameid',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  ];
  private static readonly EMAIL_CLAIM_KEYS = [
    'email',
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  ];

  getToken(): string | null {
    return localStorage.getItem(TokenService.KEY);
  }

  setToken(token: string): void {
    localStorage.setItem(TokenService.KEY, token);
  }

  clear(): void {
    localStorage.removeItem(TokenService.KEY);
  }

  decode(): CurrentUser | null {
    const token = this.getToken();
    if (!token) return null;

    let raw: Record<string, unknown>;
    try {
      raw = jwtDecode<Record<string, unknown>>(token);
    } catch {
      return null;
    }

    const userId = Number(this.firstClaim(raw, TokenService.USER_ID_CLAIM_KEYS));
    if (!Number.isFinite(userId)) return null;

    const email = String(this.firstClaim(raw, TokenService.EMAIL_CLAIM_KEYS) ?? '');
    const roleRaw = this.firstClaim(raw, TokenService.ROLE_CLAIM_KEYS);
    const role = (Array.isArray(roleRaw) ? roleRaw[0] : roleRaw) as UserRole;
    const exp = Number(raw['exp']);

    if (!role) {
      console.warn(
        '[TokenService] JWT decoded but no role claim was found. Looked at:',
        TokenService.ROLE_CLAIM_KEYS,
        'Token payload keys:', Object.keys(raw),
      );
    }

    return { userId, email, role, exp };
  }

  isExpired(now: number = Math.floor(Date.now() / 1000)): boolean {
    const user = this.decode();
    if (!user) return true;
    return user.exp <= now;
  }
  
  private firstClaim(
    claims: Record<string, unknown>,
    keys: readonly string[],
  ): unknown {
    for (const k of keys) {
      const v = claims[k];
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return undefined;
  }
}
