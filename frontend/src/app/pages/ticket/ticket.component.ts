import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, DestroyRef, TemplateRef, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpContext } from '@angular/common/http';
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule, MatLabel } from "@angular/material/form-field";
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Observable, Subject, forkJoin, of } from 'rxjs';
import { catchError, finalize, map, startWith, switchMap } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ApiClient } from '../../core/api/api-client.service';
import { IS_API_REQUEST } from '../../core/api/api.context';
import { Ticket } from '../../models/ticket';
import { TicketAttachment } from '../../models/ticket-attachment';
import { TicketComment } from '../../models/ticket-comment';
import { TicketPriority } from '../../models/ticket-priority';
import { TicketStatus } from '../../models/ticket-status';
import { StatusBadge } from "../../components/status-badge/status-badge.component";
import { SuccessSnackbarComponent } from '../../components/success-snackbar/success-snackbar.component';
import { MatBottomSheet, MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TicketOptionsSheet, TicketOptionsSheetResult } from '../../components/ticket-options-sheet/ticket-options-sheet.component';
import { CurrentUserService } from '../../core/auth/current-user.service';
import { LocalDatePipe } from '../../pipes/local-date.pipe';
import { SignalrService } from '../../core/services/signalr.service';

type CommentContentPart =
  | { kind: 'text'; text: string }
  | { kind: 'attachment'; id: string; fileName: string };

type TicketCommentVm = TicketComment & {
  contentParts: CommentContentPart[];
};

@Component({
  selector: 'app-ticket',
  standalone: true,
  templateUrl: './ticket.component.html',
  styleUrls: ['./ticket.component.scss'],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatSnackBarModule,
    MatIconModule,
    StatusBadge,
    MatBottomSheetModule,
    MatDialogModule,
    LocalDatePipe
]
})
export class TicketComponent {
  private readonly api = inject(ApiClient);
  private readonly http = inject(HttpClient);
  private readonly dialog = inject(MatDialog);
  private readonly fb = inject(FormBuilder);
  private readonly snackBar = inject(MatSnackBar);
  private readonly _bottomSheet = inject(MatBottomSheet);
  private readonly currentUser = inject(CurrentUserService);
  private readonly signalr = inject(SignalrService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly cdr = inject(ChangeDetectorRef);

  private readonly refreshTicket$ = new Subject<void>();
  private readonly refreshComments$ = new Subject<void>();
  private readonly refreshAttachments$ = new Subject<void>();

  private readonly onNotification: (...args: unknown[]) => void = (_payload: unknown) => {
    if (!this.ticketUuid) {
      return;
    }

    this.refreshTicket$.next();
    this.refreshComments$.next();
  };

  ticketUuid: string | null;
  readonly ticket$: Observable<Ticket | null>;
  readonly comments$: Observable<TicketCommentVm[]>;
  readonly attachments$: Observable<TicketAttachment[]>;

  private attachmentsSnapshot: TicketAttachment[] = [];
  private attachmentIdSet = new Set<string>();
  isAttachmentSuggestOpen = false;
  attachmentSuggestTop = 0;
  attachmentSuggestLeft = 0;
  attachmentSuggestions: TicketAttachment[] = [];
  private attachmentSuggestQuery = '';

  readonly isAssistant$ = this.currentUser.user$.pipe(
    startWith(this.currentUser.snapshot),
    map((user) => user?.role === 'Assistant')
  );

  readonly commentForm = this.fb.group({
    content: ['', [Validators.required]]
  });

  isSubmittingComment = false;
  selectedAttachment: File | null = null;
  isUploadingAttachment = false;

  private readonly allowedAttachmentExtensions = ['.jpg', '.jpeg', '.png', '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.txt'] as const;

  constructor(private route: ActivatedRoute, private router: Router) {
    void this.signalr.start().catch(() => { });
    this.signalr.on('notification', this.onNotification);
    this.destroyRef.onDestroy(() => {
      this.signalr.off('notification', this.onNotification);
    });

    const idParam = this.route.snapshot.paramMap.get('id');
    this.ticketUuid = idParam && this.isUuid(idParam) ? idParam : null;

    if (this.ticketUuid === null) {
      this.router.navigate(['/tickets']);
      this.ticket$ = of(null);
      this.comments$ = of([]);
      this.attachments$ = of([]);
      return;
    }

    this.ticket$ = this.refreshTicket$.pipe(
      startWith(void 0),
      switchMap(() =>
        this.api.get<Ticket>(`ticket/${this.ticketUuid}`).pipe(
          catchError((err) => {
            console.error('Failed to load ticket:', err);
            return of(null);
          })
        )
      )
    );

    this.comments$ = this.refreshComments$.pipe(
      startWith(void 0),
      switchMap(() =>
        this.api.get<TicketComment[]>(`ticket/${this.ticketUuid}/comments`).pipe(
          catchError((err) => {
            console.error('Failed to load ticket comments:', err);
            return of([]);
          }),
          map((comments) => comments.map((comment) => ({
            ...comment,
            contentParts: this.parseCommentContent(comment.content)
          })))
        )
      )
    );

    this.attachments$ = this.ticket$.pipe(
      switchMap((ticket) => {
        if (!ticket) {
          return of([]);
        }

        return this.refreshAttachments$.pipe(
          startWith(void 0),
          switchMap(() =>
            this.api.get<TicketAttachment[]>(`attachment/list/${ticket.id}`).pipe(
              catchError((err) => {
                console.error('Failed to load ticket attachments:', err);
                return of([]);
              })
            )
          )
        );
      })
    );

    this.attachments$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((attachments) => {
        this.attachmentsSnapshot = attachments ?? [];
        this.attachmentIdSet = new Set(this.attachmentsSnapshot.map((a) => a.id));
        if (this.isAttachmentSuggestOpen) {
          this.attachmentSuggestions = this.filterAttachmentSuggestions(this.attachmentSuggestQuery);
          this.cdr.detectChanges();
        }
      });
  }

  onCommentTextareaEvent(textarea: HTMLTextAreaElement): void {
    const caret = textarea.selectionStart ?? 0;
    const value = textarea.value ?? '';
    const beforeCaret = value.slice(0, caret);

    const match = beforeCaret.match(/\$[^\s$]*$/);
    if (!match) {
      this.closeAttachmentSuggest();
      return;
    }

    this.attachmentSuggestQuery = match[0].slice(1);
    this.attachmentSuggestions = this.filterAttachmentSuggestions(this.attachmentSuggestQuery);
    if (!this.attachmentSuggestions.length) {
      this.closeAttachmentSuggest();
      return;
    }

    const coords = this.getCaretClientCoordinates(textarea, caret);
    const panelWidth = 280;
    const panelMaxHeight = 220;
    const verticalOffset = 60;

    let left = coords.left;
    let top = coords.top + coords.height - verticalOffset;

    const maxLeft = Math.max(8, window.innerWidth - panelWidth - 8);
    const maxTop = Math.max(8, window.innerHeight - panelMaxHeight - 8);
    left = Math.min(Math.max(8, left), maxLeft);
    top = Math.min(Math.max(8, top), maxTop);

    this.attachmentSuggestLeft = left;
    this.attachmentSuggestTop = top;
    this.isAttachmentSuggestOpen = true;
    this.cdr.detectChanges();
  }

  onCommentTextareaKeydown(event: KeyboardEvent, textarea: HTMLTextAreaElement): void {
    if (!this.isAttachmentSuggestOpen) {
      return;
    }

    if (event.key !== 'Enter') {
      return;
    }

    const suggestion = this.attachmentSuggestions[0];
    if (!suggestion?.fileName) {
      this.closeAttachmentSuggest();
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    this.applyAttachmentSuggestion(textarea, suggestion.fileName + ' ');
  }

  onCommentTextareaBlur(): void {
    this.closeAttachmentSuggest();
  }

  private closeAttachmentSuggest(): void {
    if (!this.isAttachmentSuggestOpen) {
      return;
    }
    this.isAttachmentSuggestOpen = false;
    this.attachmentSuggestQuery = '';
    this.attachmentSuggestions = [];
    this.cdr.detectChanges();
  }

  private filterAttachmentSuggestions(query: string): TicketAttachment[] {
    const q = (query ?? '').trim().toLowerCase();

    if (!q) {
      return [];
    }

    const match = this.attachmentsSnapshot.find((a) => (a.fileName ?? '').toLowerCase().startsWith(q));
    return match ? [match] : [];
  }

  private applyAttachmentSuggestion(textarea: HTMLTextAreaElement, fileName: string): void {
    const caret = textarea.selectionStart ?? 0;
    const value = textarea.value ?? '';
    const beforeCaret = value.slice(0, caret);

    const match = beforeCaret.match(/\$[^\s$]*$/);
    if (!match) {
      this.closeAttachmentSuggest();
      return;
    }

    const token = match[0];
    const start = caret - token.length;
    const replacement = `$${fileName}`;
    const nextValue = value.slice(0, start) + replacement + value.slice(caret);

    textarea.value = nextValue;
    const nextCaret = start + replacement.length;
    textarea.setSelectionRange(nextCaret, nextCaret);

    this.commentForm.get('content')?.setValue(nextValue);
    this.closeAttachmentSuggest();
  }

  private getCaretClientCoordinates(textarea: HTMLTextAreaElement, position: number): { left: number; top: number; height: number } {
    const computed = window.getComputedStyle(textarea);
    const div = document.createElement('div');

    div.style.position = 'fixed';
    div.style.visibility = 'hidden';
    div.style.whiteSpace = 'pre-wrap';
    div.style.wordWrap = 'break-word';
    div.style.overflow = 'hidden';
    div.style.top = '0';
    div.style.left = '0';

    const propertiesToCopy = [
      'direction',
      'boxSizing',
      'width',
      'height',
      'overflowX',
      'overflowY',
      'borderTopWidth',
      'borderRightWidth',
      'borderBottomWidth',
      'borderLeftWidth',
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
      'fontStyle',
      'fontVariant',
      'fontWeight',
      'fontStretch',
      'fontSize',
      'fontSizeAdjust',
      'lineHeight',
      'fontFamily',
      'textAlign',
      'textTransform',
      'textIndent',
      'textDecoration',
      'letterSpacing',
      'wordSpacing',
      'tabSize',
      'MozTabSize'
    ] as const;

    for (const prop of propertiesToCopy) {
      (div.style as any)[prop] = computed.getPropertyValue(prop);
    }

    const rect = textarea.getBoundingClientRect();
    div.style.width = `${rect.width}px`;

    div.scrollTop = textarea.scrollTop;
    div.scrollLeft = textarea.scrollLeft;

    const before = textarea.value.substring(0, position);
    const after = textarea.value.substring(position);

    div.textContent = before;

    const span = document.createElement('span');

    span.textContent = after.length ? after[0] : '.';
    div.appendChild(span);

    document.body.appendChild(div);
    const spanRect = span.getBoundingClientRect();
    document.body.removeChild(div);

    return {
      left: rect.left + (spanRect.left - div.getBoundingClientRect().left),
      top: rect.top + (spanRect.top - div.getBoundingClientRect().top) - textarea.scrollTop,
      height: Number.parseFloat(computed.lineHeight || '16') || 16
    };
  }

  onCommentSubmit(formDir?: FormGroupDirective): void {
    if (!this.ticketUuid) {
      return;
    }

    const raw = this.commentForm.get('content')?.value ?? '';
    const content = String(raw).trim();
    const contentToSend = this.replaceAttachmentReferences(content);

    if (!content) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.isSubmittingComment = true;
    this.api
      .post<void>(`ticket/${this.ticketUuid}/comments`, { content: contentToSend })
      .pipe(
        finalize(() => {
          this.isSubmittingComment = false;
        })
      )
      .subscribe({
        next: () => {
          if (formDir) {
            formDir.resetForm();
          } else {
            this.commentForm.reset({ content: '' });
            this.commentForm.markAsPristine();
            this.commentForm.markAsUntouched();
          }

          SuccessSnackbarComponent.open(this.snackBar, 'Dodano komentarz');
          this.refreshComments$.next();
        },
        error: (err) => {
          console.error('Failed to add ticket comment:', err);
        }
      });
  }

  private replaceAttachmentReferences(content: string): string {
    if (!content) {
      return content;
    }

    const attachments = (this.attachmentsSnapshot ?? []).filter((a) => !!a?.id && !!a?.fileName);
    if (!attachments.length) {
      return content;
    }

    const sorted = [...attachments].sort((a, b) => (b.fileName?.length ?? 0) - (a.fileName?.length ?? 0));

    let result = content;
    for (const attachment of sorted) {
      const fileName = attachment.fileName ?? '';
      if (!fileName) {
        continue;
      }

      const escaped = this.escapeRegExp(fileName);
      const pattern = new RegExp(`\\$${escaped}(?=$|\\s|[\\]\\)\\}\\.,;:!\\?])`, 'g');
      const replacement = `\$${attachment.id}\$${fileName}`;
      result = result.replace(pattern, replacement);
    }

    return result;
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  private parseCommentContent(content: string): CommentContentPart[] {
    const text = String(content ?? '');
    if (!text) {
      return [{ kind: 'text', text: '' }];
    }

    const re = /\$([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\$([^\s$]+)(?=$|\s|[\]\)\}\.,;:!\?])/gi;

    const parts: CommentContentPart[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = re.exec(text)) !== null) {
      const index = match.index ?? 0;
      if (index > lastIndex) {
        parts.push({ kind: 'text', text: text.slice(lastIndex, index) });
      }

      const id = match[1];
      const fileName = match[2];
      parts.push({ kind: 'attachment', id, fileName });

      lastIndex = index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ kind: 'text', text: text.slice(lastIndex) });
    }

    return parts.length ? parts : [{ kind: 'text', text }];
  }

  downloadAttachmentReference(id: string, fileName: string): void {
    if (!this.isAttachmentAvailable(id)) {
      return;
    }

    this.downloadAttachment({ id, fileName } as TicketAttachment);
  }

  isAttachmentAvailable(id: string): boolean {
    return this.attachmentIdSet.has(id);
  }

  trackCommentContentPart(index: number, part: CommentContentPart): string {
    if (part.kind === 'attachment') {
      return `a:${part.id}:${part.fileName}`;
    }
    return `t:${index}`;
  }

  onAttachmentSelected(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    const file = input?.files?.item(0) ?? null;

    if (!file) {
      this.selectedAttachment = null;
      return;
    }

    if (!this.isAllowedAttachmentFile(file)) {
      this.selectedAttachment = null;
      if (input) {
        input.value = '';
      }
      this.snackBar.open('Dozwolone pliki: .jpg, .jpeg, .png, .pdf, .doc, .docx, .xls, .xlsx, .txt', 'OK', { duration: 5000 });
      return;
    }

    this.selectedAttachment = file;
  }

  uploadAttachment(ticketId: string, input?: HTMLInputElement): void {
    if (!ticketId) {
      return;
    }

    const file = this.selectedAttachment;
    if (!file) {
      return;
    }

    if (!this.isAllowedAttachmentFile(file)) {
      this.selectedAttachment = null;
      if (input) {
        input.value = '';
      }
      this.snackBar.open('Nieprawidłowy format pliku', 'OK', { duration: 3500 });
      return;
    }

    const formData = new FormData();
    formData.append('file', file, file.name);

    this.isUploadingAttachment = true;
    this.api
      .post<void>(`attachment/upload/${ticketId}`, formData)
      .pipe(
        finalize(() => {
          this.isUploadingAttachment = false;
          // App uses provideZonelessChangeDetection(); async callbacks won't automatically refresh the view.
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: () => {
          this.selectedAttachment = null;
          if (input) {
            input.value = '';
          }
          SuccessSnackbarComponent.open(this.snackBar, 'Wysłano załącznik');
          this.refreshAttachments$.next();
        },
        error: (err) => {
          console.error('Failed to upload attachment:', err);
          this.snackBar.open('Nie udało się wysłać pliku', 'OK', { duration: 3500 });
        }
      });
  }

  downloadAttachment(attachment: TicketAttachment): void {
    const context = new HttpContext().set(IS_API_REQUEST, true);

    this.http
      .get(`attachment/download/${attachment.id}`, { responseType: 'blob', context })
      .subscribe({
        next: (blob) => {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = attachment.fileName || 'attachment';
          a.click();
          URL.revokeObjectURL(url);
        },
        error: (err) => {
          console.error('Failed to download attachment:', err);
          this.snackBar.open('Nie udało się pobrać pliku', 'OK', { duration: 3500 });
        }
      });
  }

  private isAllowedAttachmentFile(file: File): boolean {
    const name = (file.name ?? '').toLowerCase();
    return this.allowedAttachmentExtensions.some((ext) => name.endsWith(ext));
  }

  confirmDeleteAttachment(attachment: TicketAttachment, dialogTpl: TemplateRef<unknown>): void {
    this.dialog
      .open<unknown, TicketAttachment, boolean>(dialogTpl, {
        data: attachment
      })
      .afterClosed()
      .subscribe((confirmed) => {
        if (confirmed) {
          this.deleteAttachment(attachment);
        }
      });
  }

  private deleteAttachment(attachment: TicketAttachment): void {
    this.api.delete<void>(`attachment/${attachment.id}`).subscribe({
      next: () => {
        SuccessSnackbarComponent.open(this.snackBar, 'Usunięto załącznik');
        this.refreshAttachments$.next();
      },
      error: (err) => {
        console.error('Failed to delete attachment:', err);
        this.snackBar.open('Nie udało się usunąć załącznika', 'OK', { duration: 3500 });
      }
    });
  }

  private isUuid(value: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
  }

  openBottomSheet(ticket: Ticket): void {
    if (!this.ticketUuid) {
      return;
    }

    const sheetRef = this._bottomSheet.open(TicketOptionsSheet, {
      data: {
        ticketUuid: this.ticketUuid,
        priority: ticket.priority,
        status: ticket.status,
      },
    });

    sheetRef.afterDismissed().subscribe((result?: TicketOptionsSheetResult) => {
      if (!result) {
        return;
      }

      const statusChanged = result.status !== ticket.status;
      const priorityChanged = result.priority !== ticket.priority;

      const requests: Array<Observable<unknown>> = [];

      if (statusChanged) {
        requests.push(this.api.post<void>(`ticket/${this.ticketUuid}/status/${Number(result.status)}`));
      }
      if (priorityChanged) {
        requests.push(this.api.post<void>(`ticket/${this.ticketUuid}/priority/${Number(result.priority)}`));
      }

      if (!requests.length) {
        if (result.assignedToMe) {
          SuccessSnackbarComponent.open(this.snackBar, 'Przypisano zgłoszenie');
          this.refreshTicket$.next();
        }
        return;
      }

      forkJoin(requests)
        .pipe(
          catchError((err) => {
            console.error('Failed to update ticket options:', err);
            return of(null);
          })
        )
        .subscribe((res) => {
          if (res === null) {
            return;
          }

          SuccessSnackbarComponent.open(this.snackBar, 'Zapisano zmiany');
          this.refreshTicket$.next();
        });
    });
  }

  formatTicketSlug(slug: number | null | undefined): string {
    if (typeof slug !== 'number' || !Number.isFinite(slug)) {
      return '—';
    }
    return String(slug).padStart(4, '0');
  }

  statusLabel(status: TicketStatus | null | undefined): string {
    switch (status) {
      case TicketStatus.Open:
        return 'Otwarte';
      case TicketStatus.InProgress:
        return 'W trakcie';
      case TicketStatus.WaitingForCustomer:
        return 'Czeka na klienta';
      case TicketStatus.OnHold:
        return 'Wstrzymane';
      case TicketStatus.Resolved:
        return 'Rozwiązane';
      case TicketStatus.Close:
        return 'Zamknięte';
      default:
        return '—';
    }
  }

  priorityLabel(priority: TicketPriority | null | undefined): string {
    switch (priority) {
      case TicketPriority.low:
        return 'Niski priorytet';
      case TicketPriority.medium:
        return 'Normalny priorytet';
      case TicketPriority.high:
        return 'Wysoki priorytet';
      case TicketPriority.urgent:
        return 'Pilny priorytet';
      default:
        return '—';
    }
  }

  priorityDotClass(priority: TicketPriority | null | undefined): string {
    switch (priority) {
      case TicketPriority.low:
        return 'priority-low';
      case TicketPriority.medium:
        return 'priority-medium';
      case TicketPriority.high:
        return 'priority-high';
      case TicketPriority.urgent:
        return 'priority-urgent';
      default:
        return '';
    }
  }

  trackComment(_index: number, comment: TicketComment): string {
    return `${comment.createdAt}|${comment.authorName}|${comment.content}`;
  }
}