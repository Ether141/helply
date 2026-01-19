import { ChangeDetectorRef, Component, DestroyRef, OnInit, inject } from '@angular/core';
import { MatRipple } from "@angular/material/core";
import { RouterLink } from "@angular/router";
import { of } from 'rxjs';
import { catchError, distinctUntilChanged, map, startWith, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { StatusBadge } from "../../components/status-badge/status-badge.component";
import { ApiClient } from '../../core/api/api-client.service';
import { CurrentUserService } from '../../core/auth/current-user.service';
import { SignalrService } from '../../core/services/signalr.service';
import { Ticket } from '../../models/ticket';
import { TicketStatus } from '../../models/ticket-status';
import { TicketSummary } from '../../models/ticket-summary';
import { LocalDatePipe } from '../../pipes/local-date.pipe';

export interface DashboardTicketRow {
  id: number;
  uuid: string;
  name: string;
  assignedTo: string;
  lastUpdate: string;
  status: TicketStatus;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [MatRipple, RouterLink, StatusBadge, CommonModule, LocalDatePipe]
})
export class DashboardComponent implements OnInit {
  private readonly api = inject(ApiClient);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);
  private readonly currentUser = inject(CurrentUserService);

  protected isUser = false;
  protected recentTicketsLimit = 5;

  protected summary: TicketSummary = {
    open: 0,
    inProgress: 0,
    waitingForCustomer: 0,
    onHold: 0,
    resolved: 0,
    closed: 0,
  };

  protected recentTickets: DashboardTicketRow[] = [];

  ngOnInit(): void {
    this.api
      .get<TicketSummary>('ticket/summary')
      .pipe(
        catchError((err) => {
          console.error('Failed to load ticket summary:', err);
          return of({
            open: 0,
            inProgress: 0,
            waitingForCustomer: 0,
            onHold: 0,
            resolved: 0,
            closed: 0,
          } satisfies TicketSummary);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((summary) => {
        this.summary = summary;
        this.cdr.detectChanges();
      });

    this.currentUser.user$
      .pipe(
        startWith(this.currentUser.snapshot),
        map((user) => {
          this.isUser = user?.role === 'User';
          this.recentTicketsLimit = this.isUser ? 5 : 10;
          return user?.role ?? null;
        }),
        distinctUntilChanged(),
        switchMap((role) => {
          return this.api.get<Ticket[]>(`ticket/my`).pipe(
            catchError((err) => {
              console.error('Failed to load dashboard tickets:', err);
              return of([] as Ticket[]);
            })
          );
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((tickets) => {
        const top5 = [...tickets]
          .filter((t) => t.status !== TicketStatus.Close)
          .sort((a, b) => {
            const aTime = new Date(a.updatedAt ?? 0).getTime();
            const bTime = new Date(b.updatedAt ?? 0).getTime();
            return bTime - aTime;
          })
          .slice(0, this.recentTicketsLimit)
          .sort((a, b) => a.slug - b.slug);

        this.recentTickets = top5.map((t) => ({
          id: t.slug,
          uuid: t.id,
          name: t.title,
          assignedTo: t.assistantName == null ? '—' : t.assistantName,
          lastUpdate: t.updatedAt,
          status: t.status,
        }));

        this.cdr.detectChanges();
      });
  }

  protected formatTicketId(id: number): string {
    return String(id).padStart(4, '0');
  }
}
