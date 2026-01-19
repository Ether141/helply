import { ChangeDetectorRef, Component, DestroyRef, NgZone, ViewChild, inject } from "@angular/core";
import { Router } from '@angular/router';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatSort, MatSortModule } from "@angular/material/sort";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { of } from "rxjs";
import { catchError, distinctUntilChanged, map, startWith, switchMap } from "rxjs/operators";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { StatusBadge } from "../../components/status-badge/status-badge.component";
import { ApiClient } from "../../core/api/api-client.service";
import { CurrentUserService } from "../../core/auth/current-user.service";
import { Ticket } from "../../models/ticket";
import { TicketStatus } from "../../models/ticket-status";
import { BreakpointObserver } from "@angular/cdk/layout";
import { LocalDatePipe } from "../../pipes/local-date.pipe";

export interface TicketTableData {
    id: number;
    uuid: string;
    name: string;
    assignedTo: string;
    lastUpdate: string;
    status: TicketStatus;
}

@Component({
    selector: "app-tickets",
    standalone: true,
    templateUrl: "./tickets.component.html",
    styleUrls: ["./tickets.component.scss"],
    imports: [MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule, StatusBadge, LocalDatePipe]
})
export class TicketsComponent {
    private readonly api = inject(ApiClient);
    private readonly destroyRef = inject(DestroyRef);
    private readonly currentUser = inject(CurrentUserService);
    private readonly breakpointObserver = inject(BreakpointObserver);
    private readonly ngZone = inject(NgZone);
    private readonly cdr = inject(ChangeDetectorRef);

    displayedColumns: string[] = ['id', 'name', 'assignedTo', 'lastUpdate', 'status'];
    dataSource: MatTableDataSource<TicketTableData>;

    @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
    @ViewChild(MatSort) sort: MatSort | undefined;

    constructor(private router: Router) {
        this.dataSource = new MatTableDataSource<TicketTableData>([]);

        this.breakpointObserver
            .observe(['(max-width: 1200px)', '(max-width: 950px)', '(max-width: 700px)'])
            .pipe(
                map((state) => {
                    if (state.breakpoints['(max-width: 700px)']) {
                        return ['id', 'name'];
                    }

                    if (state.breakpoints['(max-width: 950px)']) {
                        return ['id', 'name', 'status'];
                    }

                    if (state.breakpoints['(max-width: 1200px)']) {
                        return ['id', 'name', 'lastUpdate', 'status'];
                    }

                    return ['id', 'name', 'assignedTo', 'lastUpdate', 'status'];
                }),
                distinctUntilChanged((prev, curr) => prev.join('|') === curr.join('|')),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((cols) => {
                this.ngZone.run(() => {
                    this.displayedColumns = cols;
                    this.cdr.markForCheck();
                });
            });

        this.currentUser.user$
            .pipe(
                startWith(this.currentUser.snapshot),
                map((user) => user?.role ?? null),
                distinctUntilChanged(),
                switchMap((role) => {
                    const endpoint = role === 'Assistant' ? 'ticket' : 'ticket/my';

                    return this.api.get<Ticket[]>(endpoint).pipe(
                        catchError((err) => {
                            console.error("Failed to load tickets:", err);
                            return of([] as Ticket[]);
                        })
                    );
                }),
                takeUntilDestroyed(this.destroyRef)
            )
            .subscribe((tickets) => {
                this.dataSource.data = tickets.map((t) => ({
                    id: t.slug,
                    uuid: t.id,
                    name: t.title,
                    assignedTo: t.assistantName == null ? '—' : t.assistantName,
                    lastUpdate: t.updatedAt,
                    status: t.status,
                }));
            });
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    openTicket(row: TicketTableData) {
        this.router.navigate(['/ticket', row.uuid]);
    }

    formatTicketId(id: number): string {
        return String(id).padStart(4, '0');
    }
}