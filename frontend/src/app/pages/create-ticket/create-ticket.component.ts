import { Component, DestroyRef, inject } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatButtonModule } from "@angular/material/button";
import { MatSnackBar, MatSnackBarModule } from "@angular/material/snack-bar";
import { of } from "rxjs";
import { catchError } from "rxjs/operators";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";

import { ApiClient } from "../../core/api/api-client.service";

export interface TicketCategoryDto {
  id: string | number;
  name: string;
  description?: string;
}

interface CreateTicketRequest {
  title: string;
  description: string;
  categoryId: string | number;
  priority: number;
}

interface CreateTicketResponse {
  id: string;
}

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.scss'],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
  ]
})
export class CreateTicketComponent {
  private readonly fb = inject(FormBuilder);
  private readonly api = inject(ApiClient);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly destroyRef = inject(DestroyRef);

  categories: TicketCategoryDto[] = [];

  ticketForm: FormGroup = this.fb.group({
    title: ["", [Validators.required, Validators.maxLength(100)]],
    category: ["", [Validators.required]],
    priority: [1, [Validators.required]],
    description: ["", [Validators.required, Validators.minLength(10)]],
  });

  constructor() {
    this.api
      .get<TicketCategoryDto[]>("ticket/categories")
      .pipe(
        catchError((err) => {
          this.snackBar.open("Nie udało się pobrać kategorii zgłoszeń", "OK", { duration: 3500 });
          return of([] as TicketCategoryDto[]);
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((categories) => {
        this.categories = categories;
      });
  }

  onSubmit(): void {
    if (this.ticketForm.invalid) {
      this.ticketForm.markAllAsTouched();
      return;
    }

    const title = this.ticketForm.get("title")?.value as string;
    const description = this.ticketForm.get("description")?.value as string;
    const categoryId = this.ticketForm.get("category")?.value as string | number;
    const priority = this.ticketForm.get("priority")?.value as number;

    const payload: CreateTicketRequest = {
      title,
      description,
      categoryId,
      priority,
    };

    this.api
      .post<CreateTicketResponse>("ticket/create", payload)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (created) => {
          if (created?.id) {
            this.router.navigate(["/ticket", created.id]);
            return;
          }

          this.snackBar.open("Zgłoszenie utworzone, ale brak ID w odpowiedzi", "OK", { duration: 3500 });
        },
        error: (err) => {
          this.snackBar.open("Nie udało się utworzyć zgłoszenia", "OK", { duration: 3500 });
        },
      });
  }
}