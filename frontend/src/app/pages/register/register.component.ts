import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ApiClient } from '../../core/api/api-client.service';
import { ApiError } from '../../core/api/api-error';
import { AuthTokenStorage } from '../../core/auth/auth-token.storage';
import { SignalrService } from '../../core/services/signalr.service';
import { SuccessSnackbarComponent } from '../../components/success-snackbar/success-snackbar.component';

interface RegisterResponse {
  accessToken: string;
  refreshToken: string;
}

interface MeResponse {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterLink,
    MatProgressSpinnerModule,
    MatSnackBarModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  form!: FormGroup;

  protected isRegistering: boolean = false;
  protected errorMessage: string | null = null;

  private readonly api = inject(ApiClient);
  private readonly tokenStorage = inject(AuthTokenStorage);
  private readonly signalr = inject(SignalrService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly snackBar = inject(MatSnackBar);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(3)]],
      lastName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.pattern(/^(?=.*[A-Z])(?=.*\d).{8,}$/)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });

    this.redirectIfAlreadyLoggedIn();
  }

  private redirectIfAlreadyLoggedIn(): void {
    if (!this.tokenStorage.getAccessToken()) {
      return;
    }

    this.api.get<MeResponse>('/user/me').subscribe({
      next: () => {
        void this.router.navigateByUrl('/dashboard');
      },
      error: (err: ApiError) => {
        if (err.status === 401 || err.status === 403) {
          void this.signalr.stop().catch(() => {
            // Nie blokuj.
          });
          this.tokenStorage.clear();
        }
      }
    });
  }

  get firstNameControl() {
    return this.form.get('firstName');
  }

  get lastNameControl() {
    return this.form.get('lastName');
  }

  get emailControl() {
    return this.form.get('email');
  }

  get passwordControl() {
    return this.form.get('password');
  }

  get confirmPasswordControl() {
    return this.form.get('confirmPassword');
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    const pw = password?.value;
    const cpw = confirmPassword?.value;

    // Only show mismatch when both fields have values
    const mismatch = pw && cpw && pw !== cpw;

    if (confirmPassword) {
      const existingErrors = confirmPassword.errors || {};
      if (mismatch) {
        confirmPassword.setErrors({ ...existingErrors, passwordMismatch: true });
      } else {
        // Remove passwordMismatch error while keeping others
        if ('passwordMismatch' in existingErrors) {
          const { passwordMismatch, ...rest } = existingErrors as any;
          const newErrors = Object.keys(rest).length ? rest : null;
          confirmPassword.setErrors(newErrors);
        }
      }
    }

    // Return group-level error for potential form-level checks
    return mismatch ? { passwordMismatch: true } : null;
  }

  submit() {
    if (this.form.invalid) return;

    const { firstName, lastName, email, password } = this.form.getRawValue() as {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      confirmPassword: string;
    };

    this.isRegistering = true;
    this.errorMessage = null;
    this.cdr.markForCheck();

    this.api
      .post<RegisterResponse>('/user/register', {
        FirstName: firstName,
        LastName: lastName,
        Email: email,
        Password: password
      })
      .subscribe({
        next: (res) => {
          this.tokenStorage.set({
            accessToken: res.accessToken,
            refreshToken: res.refreshToken
          });

          void this.signalr.start().catch(() => {
            // Nie blokuj rejestracji jeśli hub jest niedostępny.
          });

          this.isRegistering = false;
          this.cdr.markForCheck();

          void this.router.navigateByUrl('/dashboard').then(() => {
            SuccessSnackbarComponent.open(this.snackBar, 'Konto zostało utworzone pomyślnie.');
          });
        },
        error: () => {
          this.errorMessage = 'Nie udało się utworzyć konta.';
          this.isRegistering = false;
          this.cdr.markForCheck();
        }
      });
  }
}
