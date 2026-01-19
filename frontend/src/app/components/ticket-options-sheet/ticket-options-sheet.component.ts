import { Component, inject } from "@angular/core";
import { MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from "@angular/material/bottom-sheet";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { ReactiveFormsModule, FormControl } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { TicketPriority } from "../../models/ticket-priority";
import { TicketStatus } from "../../models/ticket-status";
import { ApiClient } from "../../core/api/api-client.service";
import { CurrentUserService } from "../../core/auth/current-user.service";

export interface TicketOptionsSheetInputData {
  ticketUuid: string;
  priority: TicketPriority;
  status: TicketStatus;
}

export interface TicketOptionsSheetResult {
  priority: TicketPriority;
  status: TicketStatus;
  assignedToMe?: boolean;
}

@Component({
  selector: "app-ticket-options-sheet",
  standalone: true,
  templateUrl: "ticket-options-sheet.component.html",
  styleUrl: "ticket-options-sheet.component.scss",
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule, MatButtonModule],
})
export class TicketOptionsSheet {
  private readonly _bottomSheetRef =
    inject<MatBottomSheetRef<TicketOptionsSheet>>(MatBottomSheetRef);

  private readonly _data = inject<TicketOptionsSheetInputData | null>(MAT_BOTTOM_SHEET_DATA, {
    optional: true,
  });

  private readonly api = inject(ApiClient);
  private readonly currentUser = inject(CurrentUserService);

  readonly user$ = this.currentUser.user$;

  readonly priorities: Array<{ value: TicketPriority; label: string }> = [
    { value: TicketPriority.low, label: "Niski" },
    { value: TicketPriority.medium, label: "Normalny" },
    { value: TicketPriority.high, label: "Wysoki" },
    { value: TicketPriority.urgent, label: "Pilny" },
  ];

  readonly statuses: Array<{ value: TicketStatus; label: string }> = [
    { value: TicketStatus.Open, label: "Otwarte" },
    { value: TicketStatus.InProgress, label: "W toku" },
    { value: TicketStatus.WaitingForCustomer, label: "Oczekuje na klienta" },
    { value: TicketStatus.OnHold, label: "Wstrzymane" },
    { value: TicketStatus.Resolved, label: "Rozwiązane" },
    { value: TicketStatus.Close, label: "Zamknięte" },
  ];

  readonly priorityCtrl = new FormControl<TicketPriority>(this._data?.priority ?? TicketPriority.medium, {
    nonNullable: true,
  });
  readonly statusCtrl = new FormControl<TicketStatus>(this._data?.status ?? TicketStatus.Open, {
    nonNullable: true,
  });

  save(): void {
    this._bottomSheetRef.dismiss({
      priority: this.priorityCtrl.value,
      status: this.statusCtrl.value,
    });
  }

  assignToMe(): void {
    const ticketUuid = this._data?.ticketUuid;
    if (!ticketUuid) {
      return;
    }

    this.api.post<void>(`ticket/${ticketUuid}/assign`).subscribe({
      next: () => {
        this._bottomSheetRef.dismiss({
          priority: this.priorityCtrl.value,
          status: this.statusCtrl.value,
          assignedToMe: true,
        });
      },
      error: (err) => {
        console.error('Failed to assign ticket:', err);
      },
    });
  }

  cancel(): void {
    this._bottomSheetRef.dismiss();
  }
}