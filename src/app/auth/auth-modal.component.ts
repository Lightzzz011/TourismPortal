import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/auth.service';

type AuthMode = 'signin' | 'signup';

@Component({
  selector: 'app-auth-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
})
export class AuthModal {
  @Input({ required: true }) mode: AuthMode = 'signin';
  @Output() closed = new EventEmitter<void>();
  @Output() success = new EventEmitter<void>();

  readonly formError = signal<string | null>(null);
  readonly closing = signal(false);

  name = '';
  email = '';
  phone = '';
  password = '';
  confirmPassword = '';
  otpCode = '';
  isForgotPassword = false;
  otpRequested = false;
  otpPreview = '';
  otpVerified = false;
  otpStatusMessage = '';
  isSendingOtp = false;
  submitted = false;
  focusedField: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  setFocused(field: string): void {
    this.focusedField = field;
  }

  clearFocused(): void {
    this.focusedField = null;
  }

  get nameError(): string {
    if (!this.submitted || this.mode !== 'signup') return '';
    if (!this.name?.trim()) return 'Name is required';
    if (this.name.trim().length < 2) return 'Name is too short';
    return '';
  }

  get emailError(): string {
    if (!this.submitted) return '';
    if (!this.email?.trim()) return 'Email is required';
    if (!this.isValidEmail(this.email)) return 'Invalid email format';
    return '';
  }

  get phoneError(): string {
    if (this.mode !== 'signup' || !this.submitted) return '';
    if (this.phone?.trim() && !this.isValidPhone(this.phone)) {
      return 'Phone must be 10 to 15 digits';
    }
    return '';
  }

  get passwordError(): string {
    if (!this.submitted) return '';
    if (!this.password?.trim()) return 'Password is required';
    if (!this.isStrongPassword(this.password)) {
      return 'Password needs 8+ chars with upper, lower, and number';
    }
    return '';
  }

  get confirmPasswordError(): string {
    if (!this.submitted || !this.isForgotPassword) return '';
    if (!this.confirmPassword?.trim()) return 'Confirm password is required';
    if (this.confirmPassword !== this.password) return 'Passwords do not match';
    return '';
  }

  get otpError(): string {
    if (!this.submitted || this.mode !== 'signup' || this.isForgotPassword || !this.otpRequested) return '';
    if (!this.otpCode.trim()) return 'OTP is required';
    if (!/^\d{6}$/.test(this.otpCode.trim())) return 'OTP must be 6 digits';
    return '';
  }

  async submit(): Promise<void> {
    this.submitted = true;
    this.formError.set(null);

    if (this.isForgotPassword) {
      if (!this.validateForgotPassword()) {
        return;
      }
      const resetOk = await this.authService.resetPassword(this.email, this.password);
      if (!resetOk) {
        this.formError.set('No account found for this email. Please sign up.');
        return;
      }
      this.isForgotPassword = false;
      this.submitted = false;
      this.confirmPassword = '';
      this.formError.set('Password reset successful. Please sign in.');
      this.router.navigateByUrl('/signin');
      return;
    }

    if (!this.validate()) {
      return;
    }

    if (this.mode === 'signin') {
      const ok = await this.authService.signIn(this.email, this.password);
      if (!ok) {
        this.formError.set('Invalid email or password.');
        return;
      }

      this.success.emit();
      this.closed.emit();
      return;
    }

    if (!this.otpRequested) {
      await this.sendOtp();
      return;
    }

    if (!this.validateOtp()) {
      return;
    }

    const verification = await this.authService.verifySignupOtp(this.email, this.otpCode);
    if (!verification.ok) {
      this.formError.set(verification.message);
      return;
    }
    this.otpVerified = true;

    const ok = await this.authService.signUp(
      {
        name: this.name.trim(),
        email: this.email.trim(),
        phone: this.phone.trim() || undefined,
        emailVerified: true,
        authProvider: 'local',
      },
      this.password,
    );
    if (!ok) {
      this.formError.set('Email already exists. Try signing in.');
      return;
    }

    this.closing.set(true);
    window.setTimeout(() => {
      this.success.emit();
      if (window.history.length > 1) {
        window.history.back();
        return;
      }
      this.router.navigateByUrl('/');
    }, 550);
  }

  close(): void {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }
    this.router.navigateByUrl('/');
  }

  openForgotPassword(): void {
    this.isForgotPassword = true;
    this.submitted = false;
    this.formError.set(null);
    this.password = '';
    this.confirmPassword = '';
  }

  cancelForgotPassword(): void {
    this.isForgotPassword = false;
    this.submitted = false;
    this.formError.set(null);
    this.password = '';
    this.confirmPassword = '';
  }

  switchMode(nextMode: AuthMode): void {
    this.isForgotPassword = false;
    this.resetTransientState();
    this.password = '';
    this.confirmPassword = '';
    this.router.navigateByUrl(`/${nextMode}`);
  }

  async sendOtp(): Promise<void> {
    this.submitted = true;
    this.formError.set(null);

    if (!this.validateSignupBase()) {
      return;
    }

    if (this.authService.userExists(this.email)) {
      this.formError.set('Email already exists. Try signing in.');
      return;
    }

    this.isSendingOtp = true;
    const result = await this.authService.requestSignupOtp(this.email);
    this.isSendingOtp = false;

    if (!result.ok) {
      this.formError.set(result.message);
      return;
    }

    this.otpRequested = true;
    this.otpVerified = false;
    this.otpPreview = result.previewOtp ?? '';
    this.otpStatusMessage = result.message;
  }

  async continueWithProvider(provider: 'google' | 'facebook' | 'apple'): Promise<void> {
    this.formError.set(null);
    await this.authService.signInWithProvider(provider);
    this.success.emit();
    this.closed.emit();
  }

  onEmailChanged(): void {
    if (this.mode !== 'signup' || this.isForgotPassword) {
      return;
    }
    this.otpRequested = false;
    this.otpVerified = false;
    this.otpPreview = '';
    this.otpCode = '';
    this.otpStatusMessage = '';
  }

  private validate(): boolean {
    if (this.mode === 'signup' && this.name.trim().length < 2) {
      return false;
    }

    if (this.mode === 'signup' && this.phone.trim() && !this.isValidPhone(this.phone)) {
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      return false;
    }

    if (!this.isStrongPassword(this.password)) {
      return false;
    }

    return true;
  }

  private validateSignupBase(): boolean {
    if (this.mode !== 'signup') {
      return false;
    }

    if (this.name.trim().length < 2) {
      return false;
    }

    if (this.phone.trim() && !this.isValidPhone(this.phone)) {
      return false;
    }

    if (!this.isValidEmail(this.email)) {
      return false;
    }

    if (!this.isStrongPassword(this.password)) {
      return false;
    }

    return true;
  }

  private validateOtp(): boolean {
    return /^\d{6}$/.test(this.otpCode.trim());
  }

  private resetTransientState(): void {
    this.submitted = false;
    this.formError.set(null);
    this.otpCode = '';
    this.otpRequested = false;
    this.otpPreview = '';
    this.otpVerified = false;
    this.otpStatusMessage = '';
  }

  private validateForgotPassword(): boolean {
    if (!this.isValidEmail(this.email)) {
      return false;
    }
    if (!this.isStrongPassword(this.password)) {
      return false;
    }
    if (!this.confirmPassword?.trim()) {
      return false;
    }
    if (this.confirmPassword !== this.password) {
      return false;
    }
    return true;
  }

  private isValidEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  private isStrongPassword(value: string): boolean {
    return value.length >= 8 && /[A-Z]/.test(value) && /[a-z]/.test(value) && /[0-9]/.test(value);
  }

  private isValidPhone(value: string): boolean {
    return /^\+?[0-9]{10,15}$/.test(value.trim());
  }
}
