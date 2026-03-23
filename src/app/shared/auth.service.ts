import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { firstValueFrom } from 'rxjs';

export type AuthUser = {
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  emailVerified?: boolean;
  authProvider?: 'local' | 'google' | 'facebook' | 'apple';
};

const USER_KEY = 'travel_user';
const USERS_KEY = 'travel_users';
const OTP_KEY_PREFIX = 'travel_signup_otp_';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(
    this.loadActiveUser(),
  );

  readonly user$ = this.userSubject.asObservable();

  get user(): AuthUser | null {
    return this.userSubject.value;
  }

  async signIn(email: string, password: string): Promise<boolean> {
    const users = this.loadUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const match = users.find(
      (item) => item.email.toLowerCase() === normalizedEmail,
    );
    if (!match) {
      return false;
    }
    const storedPassword = localStorage.getItem(this.getPasswordKey(normalizedEmail));
    const hashedPassword = await this.hashPassword(password);
    if (!storedPassword) {
      return false;
    }
    if (storedPassword !== hashedPassword) {
      if (storedPassword !== password) {
        return false;
      }
      localStorage.setItem(this.getPasswordKey(normalizedEmail), hashedPassword);
    }
    this.setActiveUser(match);
    return true;
  }

  async signUp(user: Omit<AuthUser, 'role'>, password: string): Promise<boolean> {
    const users = this.loadUsers();
    const exists = users.some(
      (item) => item.email.toLowerCase() === user.email.toLowerCase(),
    );
    if (exists) {
      return false;
    }
    const nextUser: AuthUser = {
      name: user.name.trim(),
      email: user.email.trim(),
      phone: user.phone?.trim() || undefined,
      role: 'user',
      emailVerified: user.emailVerified ?? false,
      authProvider: user.authProvider ?? 'local',
    };
    const nextUsers = [...users, nextUser];
    localStorage.setItem(USERS_KEY, JSON.stringify(nextUsers));
    localStorage.setItem(this.getPasswordKey(nextUser.email), await this.hashPassword(password));
    this.setActiveUser(nextUser);
    return true;
  }

  async requestSignupOtp(email: string): Promise<{ ok: boolean; message: string; previewOtp?: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return { ok: false, message: 'Email is required.' };
    }
    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean; message: string; previewOtp?: string }>(
          '/api/auth/request-otp',
          { email: normalizedEmail },
        ),
      );
      return {
        ok: response.success,
        message: response.message,
        previewOtp: response.previewOtp,
      };
    } catch {
      const otp = this.createOtp();
      this.storeLocalOtp(normalizedEmail, otp);
      return {
        ok: true,
        message: 'OTP generated in local demo mode because the OTP server is unavailable.',
        previewOtp: otp,
      };
    }
  }

  async verifySignupOtp(email: string, otp: string): Promise<{ ok: boolean; message: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    try {
      const response = await firstValueFrom(
        this.http.post<{ success: boolean; message: string }>('/api/auth/verify-otp', {
          email: normalizedEmail,
          otp: otp.trim(),
        }),
      );
      return { ok: response.success, message: response.message };
    } catch {
      return this.verifyLocalOtp(normalizedEmail, otp.trim());
    }
  }

  async signInWithProvider(provider: 'google' | 'facebook' | 'apple'): Promise<AuthUser> {
    const email = `${provider}.traveler@travel.demo`;
    const users = this.loadUsers();
    let providerUser = users.find((item) => item.email.toLowerCase() === email);

    if (!providerUser) {
      providerUser = {
        name: `${provider[0].toUpperCase()}${provider.slice(1)} Traveler`,
        email,
        role: 'user',
        phone: undefined,
        emailVerified: true,
        authProvider: provider,
      };
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, providerUser]));
      localStorage.setItem(this.getPasswordKey(email), await this.hashPassword(`${provider}-oauth-demo`));
    }

    this.setActiveUser(providerUser);
    return providerUser;
  }

  signOut(): void {
    localStorage.removeItem(USER_KEY);
    this.userSubject.next(null);
  }

  userExists(email: string): boolean {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      return false;
    }
    return this.loadUsers().some((item) => item.email.toLowerCase() === normalizedEmail);
  }

  async resetPassword(email: string, newPassword: string): Promise<boolean> {
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !this.userExists(normalizedEmail)) {
      return false;
    }
    localStorage.setItem(this.getPasswordKey(normalizedEmail), await this.hashPassword(newPassword));
    return true;
  }

  updateProfile(user: Omit<AuthUser, 'role'>): { ok: boolean; error?: string } {
    const currentUser = this.userSubject.value;
    if (!currentUser) {
      return { ok: false, error: 'You are not signed in.' };
    }

    const nextUser: AuthUser = {
      name: user.name.trim(),
      email: user.email.trim(),
      phone: user.phone?.trim() || undefined,
      role: currentUser.role,
      emailVerified: currentUser.emailVerified ?? true,
      authProvider: currentUser.authProvider ?? 'local',
    };

    const users = this.loadUsers();
    const currentEmail = currentUser.email.toLowerCase();
    const nextEmail = nextUser.email.toLowerCase();

    const duplicateEmail = users.some(
      (item) => item.email.toLowerCase() === nextEmail && item.email.toLowerCase() !== currentEmail,
    );
    if (duplicateEmail) {
      return { ok: false, error: 'Email already exists.' };
    }

    const userIndex = users.findIndex((item) => item.email.toLowerCase() === currentEmail);
    if (userIndex >= 0) {
      users[userIndex] = nextUser;
    } else {
      users.push(nextUser);
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));

    if (currentEmail !== nextEmail) {
      const oldPasswordKey = this.getPasswordKey(currentEmail);
      const newPasswordKey = this.getPasswordKey(nextEmail);
      const storedPassword = localStorage.getItem(oldPasswordKey);
      if (storedPassword) {
        localStorage.setItem(newPasswordKey, storedPassword);
        localStorage.removeItem(oldPasswordKey);
      }
    }

    this.setActiveUser(nextUser);
    return { ok: true };
  }

  private loadUsers(): AuthUser[] {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) {
      return [];
    }
    try {
      return (JSON.parse(raw) as Array<Partial<AuthUser>>)
        .filter((item): item is Partial<AuthUser> & Pick<AuthUser, 'name' | 'email'> => !!item?.name && !!item?.email)
        .map((item) => ({
          name: item.name!.trim(),
          email: item.email!.trim(),
          phone: item.phone?.trim() || undefined,
          role: item.role === 'admin' ? 'admin' : 'user',
          emailVerified: item.emailVerified !== false,
          authProvider:
            item.authProvider === 'google' ||
            item.authProvider === 'facebook' ||
            item.authProvider === 'apple'
              ? item.authProvider
              : 'local',
        }));
    } catch {
      return [];
    }
  }

  private loadActiveUser(): AuthUser | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) {
      return null;
    }
    try {
      const user = JSON.parse(raw) as Partial<AuthUser>;
      if (!user?.name || !user?.email) {
        return null;
      }
      const storedUser = this.loadUsers().find(
        (item) => item.email.toLowerCase() === user.email?.trim().toLowerCase(),
      );
      return {
        name: user.name.trim(),
        email: user.email.trim(),
        phone: user.phone?.trim() || undefined,
        role: storedUser?.role === 'admin' || user.role === 'admin' ? 'admin' : 'user',
        emailVerified: storedUser?.emailVerified ?? user.emailVerified !== false,
        authProvider:
          storedUser?.authProvider ||
          (user.authProvider === 'google' ||
          user.authProvider === 'facebook' ||
          user.authProvider === 'apple'
            ? user.authProvider
            : 'local'),
      };
    } catch {
      return null;
    }
  }

  private setActiveUser(user: AuthUser): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this.userSubject.next(user);
  }

  private getPasswordKey(email: string): string {
    return `travel_pass_${email.toLowerCase()}`;
  }

  private getOtpKey(email: string): string {
    return `${OTP_KEY_PREFIX}${email.toLowerCase()}`;
  }

  private createOtp(): string {
    return `${Math.floor(100000 + Math.random() * 900000)}`;
  }

  private storeLocalOtp(email: string, otp: string): void {
    localStorage.setItem(
      this.getOtpKey(email),
      JSON.stringify({
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
      }),
    );
  }

  private verifyLocalOtp(email: string, otp: string): { ok: boolean; message: string } {
    const raw = localStorage.getItem(this.getOtpKey(email));
    if (!raw) {
      return { ok: false, message: 'No OTP request found for this email. Please request a new OTP.' };
    }

    try {
      const payload = JSON.parse(raw) as { otp?: string; expiresAt?: number };
      if (!payload.otp || !payload.expiresAt) {
        localStorage.removeItem(this.getOtpKey(email));
        return { ok: false, message: 'OTP data is invalid. Please request a new OTP.' };
      }

      if (Date.now() > payload.expiresAt) {
        localStorage.removeItem(this.getOtpKey(email));
        return { ok: false, message: 'OTP expired. Please request a new OTP.' };
      }

      if (payload.otp !== otp) {
        return { ok: false, message: 'Incorrect OTP. Please try again.' };
      }

      localStorage.removeItem(this.getOtpKey(email));
      return { ok: true, message: 'Email verified successfully.' };
    } catch {
      localStorage.removeItem(this.getOtpKey(email));
      return { ok: false, message: 'OTP data is invalid. Please request a new OTP.' };
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const digest = await crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((value) => value.toString(16).padStart(2, '0'))
      .join('');
  }
}
