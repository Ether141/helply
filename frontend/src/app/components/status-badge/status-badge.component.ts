import { NgClass } from "@angular/common";
import { Component, Input } from "@angular/core";
import { TicketStatus } from "../../models/ticket-status";

@Component({
    selector: "app-status-badge",
    standalone: true,
    imports: [NgClass],
    template: `
        <span class="status-badge" [ngClass]="statusClass(status)">
            {{ toPl(status) }}
        </span>
    `,
    styleUrls: ["./status-badge.component.scss"],
})
export class StatusBadge {
    @Input({ required: true }) status!: TicketStatus;

    toPl(status: TicketStatus): string {
        switch (status) {
            case TicketStatus.Open:
                return "Otwarte";
            case TicketStatus.InProgress:
                return "W trakcie";
            case TicketStatus.WaitingForCustomer:
                return "Czeka na klienta";
            case TicketStatus.OnHold:
                return "Wstrzymane";
            case TicketStatus.Resolved:
                return "Rozwiązane";
            case TicketStatus.Close:
                return "Zamknięte";
            default:
                return "Otwarte";
        }
    }

    statusClass(status: TicketStatus): string {
        switch (status) {
            case TicketStatus.Open:
                return "is-open";
            case TicketStatus.InProgress:
                return "is-in-progress";
            case TicketStatus.WaitingForCustomer:
                return "is-waiting";
            case TicketStatus.OnHold:
                return "is-on-hold";
            case TicketStatus.Resolved:
                return "is-resolved";
            case TicketStatus.Close:
                return "is-closed";
            default:
                return "is-open";
        }
    }
}