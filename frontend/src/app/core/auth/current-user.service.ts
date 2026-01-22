import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, catchError, map, of, tap } from 'rxjs';

import { ApiClient } from '../api/api-client.service';
import { ApiError } from '../api/api-error';

export interface CurrentUser {
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

type MeResponse = { firstName: string; lastName: string; email: string; role: string };

@Injectable({ providedIn: 'root' })
export class CurrentUserService {
  private readonly api = inject(ApiClient);

  private readonly subject = new BehaviorSubject<CurrentUser | null>(null);
  readonly user$ = this.subject.asObservable();

  get snapshot(): CurrentUser | null {
    return this.subject.value;
  }

  set(user: CurrentUser | null): void {
    this.subject.next(user);
  }

  clear(): void {
    this.subject.next(null);
  }

  refresh(): Observable<CurrentUser | null> {
    return this.api.get<MeResponse>('/user/me').pipe(
      map((res) => ({ firstName: res.firstName, lastName: res.lastName, email: res.email, role: res.role })),
      tap((user) => this.subject.next(user)),
      catchError((_err: unknown) => {
        const err = _err as ApiError | undefined;
        if (err?.status === 401 || err?.status === 403 || err?.status === 0 || err?.kind === 'network') {
          this.subject.next(null);
        }
        return of(null);
      })
    );
  }
}
