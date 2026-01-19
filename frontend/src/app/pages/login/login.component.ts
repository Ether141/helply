import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { ApiClient } from '../../core/api/api-client.service';
import { ApiError } from '../../core/api/api-error';
import { AuthTokenStorage } from '../../core/auth/auth-token.storage';
import { SignalrService } from '../../core/services/signalr.service';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatMenuModule } from '@angular/material/menu';

interface LoginResponse {
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
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, RouterLink, MatProgressSpinner, MatMenuModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  form!: FormGroup;
  protected isLoggingIn: boolean = false;
  protected errorMessage: string | null = null;

  private readonly api = inject(ApiClient);
  private readonly tokenStorage = inject(AuthTokenStorage);
  private readonly signalr = inject(SignalrService);
  private readonly router = inject(Router);
  private readonly cdr = inject(ChangeDetectorRef);

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

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

  submit() {
    if (this.form.invalid) return;

    this.isLoggingIn = true;
    this.errorMessage = null;
    const { email, password } = this.form.getRawValue() as { email: string; password: string };

    this.api
      .post<LoginResponse>('/user/login', {
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
            // Nie blokuj logowania jeśli hub jest niedostępny.
          });

          this.isLoggingIn = false;
          this.cdr.markForCheck();
          void this.router.navigateByUrl('/dashboard');
        },
        error: (err: unknown) => {
          const apiErr = err as ApiError | undefined;
          const status = apiErr?.status;

          if (apiErr?.kind === 'network' || status === 0) {
            this.errorMessage = 'Brak połączenia z serwerem. Spróbuj ponownie.';
          } else if (status === 500 || (typeof status === 'number' && status >= 500)) {
            this.errorMessage = 'Wystąpił błąd serwera. Spróbuj ponownie później.';
          } else if (status === 401 || status === 403) {
            this.errorMessage = 'Nieprawidłowy email lub hasło.';
          } else {
            this.errorMessage = 'Nie udało się zalogować. Spróbuj ponownie.';
          }

          this.isLoggingIn = false;
          this.cdr.markForCheck();
        }
      });
  }
}
