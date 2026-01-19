import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

export interface SuccessSnackbarData {
  message: string;
  icon?: string;
}

@Component({
  selector: 'app-success-snackbar',
  standalone: true,
  imports: [MatIconModule],
  template: `
    <div class="snackbar" role="status" aria-live="polite">
      <span class="message">{{ data.message }}</span>
      <mat-icon class="icon">{{ data.icon ?? 'check_circle' }}</mat-icon>
    </div>
  `,
  styles: [
    `
      .snackbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        width: 100%;
        background-color: var(--mat-sys-success);
        color: var(--mat-sys-on-success);
      }

      .message {
        display: block;
      }

      .icon {
        flex: 0 0 auto;
      }
    `
  ]
})
export class SuccessSnackbarComponent {
  protected readonly data = inject<SuccessSnackbarData>(MAT_SNACK_BAR_DATA);

  static open(
    snackBar: MatSnackBar,
    message: string,
    options?: {
      duration?: number;
      icon?: string;
      panelClass?: string | string[];
    }
  ): MatSnackBarRef<SuccessSnackbarComponent> {
    return snackBar.openFromComponent(SuccessSnackbarComponent, {
      duration: options?.duration ?? 5000,
      data: {
        message,
        icon: options?.icon ?? 'check_circle'
      },
      panelClass: options?.panelClass ?? ['snackbar-success']
    });
  }
}
