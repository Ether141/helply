import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from "@angular/core";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { CommonModule } from "@angular/common";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatTooltipModule } from "@angular/material/tooltip";
import { Router, RouterOutlet } from "@angular/router";
import { SidenavButton } from "../../components/sidenav-button/sidenav-button.component";
import { ThemeSwitcherComponent } from "../../components/theme-switcher/theme-switcher.component";
import { MatMenuModule } from "@angular/material/menu";
import { AuthTokenStorage } from "../../core/auth/auth-token.storage";
import { CurrentUser, CurrentUserService } from "../../core/auth/current-user.service";
import { SignalrService } from "../../core/services/signalr.service";
import { ApiClient } from "../../core/api/api-client.service";
import { Notification } from "../../models/notification";
import { MatBadgeModule } from "@angular/material/badge";
import { LocalDatePipe } from "../../pipes/local-date.pipe";

@Component({
  selector: 'app-main-layout',
  imports: [RouterOutlet, CommonModule, MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule, MatListModule, MatTooltipModule, SidenavButton, ThemeSwitcherComponent, MatMenuModule, MatBadgeModule, LocalDatePipe],
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss']
})
export class MainLayoutComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly tokenStorage = inject(AuthTokenStorage);
  private readonly currentUser = inject(CurrentUserService);
  private readonly signalr = inject(SignalrService);
  private readonly api = inject(ApiClient);
  private readonly router = inject(Router);

  private readonly mobileQuery = window.matchMedia('(max-width: 750px)');

  protected isMobile = false;
  protected isSidenavCollapsed = false;
  protected isSidenavOpen = false;
  protected username: string | null = null;
  protected role: CurrentUser['role'] | null = null;
  protected notifications: Notification[] = [];

  protected get canCreateTicket(): boolean {
    return this.role !== 'Assistant';
  }

  protected get ticketsLabel(): string {
    return this.role === 'Assistant' ? 'Wszystkie zgłoszenia' : 'Moje zgłoszenia';
  }

  ngOnInit(): void {
    this.username = this.formatUsername(this.currentUser.snapshot);
    this.role = this.currentUser.snapshot?.role ?? null;

    this.currentUser.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(user => {
      this.username = this.formatUsername(user);
      this.role = user?.role ?? null;
      this.cdr.markForCheck();
    });

    this.applyViewportMode(this.mobileQuery.matches);

    const onViewportChange = (event: MediaQueryListEvent) => {
      this.applyViewportMode(event.matches);
      this.cdr.markForCheck();
    };

    this.mobileQuery.addEventListener('change', onViewportChange);
    this.destroyRef.onDestroy(() => this.mobileQuery.removeEventListener('change', onViewportChange));

    if (!this.isMobile) {
      const collapsed: string | null = localStorage.getItem('sideCollapsed');

      if (collapsed == null) {
        localStorage.setItem('sideCollapsed', String(this.isSidenavCollapsed));
      } else if (collapsed === 'true') {
        this.isSidenavCollapsed = true;
      }
    }

    this.fetchNotifications('init');

    void this.signalr.start().catch(() => { });

    this.signalr.on('notification', this.onNotification);
    this.destroyRef.onDestroy(() => {
      this.signalr.off('notification', this.onNotification);
    });
  }

  private readonly onNotification: (...args: unknown[]) => void = (payload: unknown) => {
    this.fetchNotifications('signalr');
  };

  private fetchNotifications(source: 'init' | 'signalr'): void {
    this.api
      .get<Notification[]>('/notification/all')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: notifications => {
          this.notifications = notifications;
          this.cdr.markForCheck();
        },
        error: err => console.error(`Failed to fetch notifications (${source}):`, err)
      });
  }

  protected onNotificationClick(notification: Notification): void {
    this.router.navigate(['/ticket', notification.ticketId]);

    this.api
      .post<void>(`/notification/read/${notification.notificationId}`)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.fetchNotifications('signalr'),
        error: err => console.error('Failed to mark notification as read:', err)
      });
  }

  toggleNav(): void {
    if (this.isMobile) {
      this.isSidenavOpen = !this.isSidenavOpen;
      return;
    }

    this.isSidenavCollapsed = !this.isSidenavCollapsed;
    localStorage.setItem('sideCollapsed', String(this.isSidenavCollapsed));
  }

  async logout(): Promise<void> {
    await this.signalr.stop().catch(() => { });

    this.tokenStorage.clear();
    this.currentUser.clear();
    window.location.href = '/auth/login';
  }

  private applyViewportMode(isMobile: boolean): void {
    this.isMobile = isMobile;

    if (this.isMobile) {
      this.isSidenavOpen = false;
      this.isSidenavCollapsed = false;
    }
  }

  private formatUsername(user: CurrentUser | null): string | null {
    if (!user) {
      return null;
    }

    const fullName = `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim();
    return fullName || user.email || null;
  }
}