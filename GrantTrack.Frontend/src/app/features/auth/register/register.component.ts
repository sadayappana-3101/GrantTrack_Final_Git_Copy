import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/enums';
import { AuthLayoutComponent } from '../../../shared/components/auth-layout/auth-layout.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AuthLayoutComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  private static readonly EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  private static readonly PHONE_RE = /^\d{10}$/;
  private static readonly STRONG_PWD_RE =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

  protected readonly form: FormGroup = this.fb.nonNullable.group(
    {
      name: ['', [Validators.required, Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.pattern(RegisterComponent.EMAIL_RE)]],
      phone: ['', [Validators.required, Validators.pattern(RegisterComponent.PHONE_RE)]],
      role: ['Applicant' as UserRole],
      password: ['', [Validators.required, Validators.pattern(RegisterComponent.STRONG_PWD_RE)]],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: [RegisterComponent.matchPasswords] },
  );

  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly successMessage = signal<string | null>(null);
  protected showPassword = false;

  submit(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { confirmPassword, ...payload } = this.form.getRawValue();
    void confirmPassword;

    this.submitting.set(true);
    this.auth.register(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.successMessage.set('Account created successfully. Redirecting to sign inâ€¦');
        setTimeout(() => this.router.navigateByUrl('/auth/login'), 1200);
      },
      error: (err: Error) => {
        this.submitting.set(false);
        this.errorMessage.set(err.message);
      },
    });
  }

  private static matchPasswords(group: AbstractControl): ValidationErrors | null {
    const pwd = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return pwd && confirm && pwd !== confirm ? { passwordMismatch: true } : null;
  }

  protected get name() { return this.form.get('name')!; }
  protected get email() { return this.form.get('email')!; }
  protected get phone() { return this.form.get('phone')!; }
  protected get password() { return this.form.get('password')!; }
  protected get confirmPassword() { return this.form.get('confirmPassword')!; }
}
