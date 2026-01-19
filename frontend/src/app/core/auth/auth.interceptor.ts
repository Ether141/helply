import {
  HttpClient,
  HttpContext,
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn
} from '@angular/common/http';
import { inject } from '@angular/core';

import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';

import { IS_API_REQUEST } from '../api/api.context';
import { AuthTokenStorage, type AuthTokens } from './auth-token.storage';
import { CurrentUserService } from './current-user.service';
import { SignalrService } from '../services/signalr.service';

function isAuthEndpoint(url: string): boolean {
  // ApiClient podaje zwykle '/user/login', ale baseUrl interceptor może zmienić na '/api/user/login'.
  return (
    url.startsWith('/user/login') ||
    url.startsWith('/user/refresh') ||
    url.startsWith('/api/user/login') ||
    url.startsWith('/api/user/refresh')
  );
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Doklejamy token tylko do requestów API wykonywanych przez ApiClient.
  if (!req.context.get(IS_API_REQUEST)) {
    return next(req);
  }

  const storage = inject(AuthTokenStorage);
  const http = inject(HttpClient);
  const currentUser = inject(CurrentUserService);
  const signalr = inject(SignalrService);

  // Nie dodawaj Authorization do login/refresh.
  if (isAuthEndpoint(req.url)) {
    return next(req);
  }

  // Jeśli ktoś jawnie ustawił Authorization, nie nadpisuj.
  if (req.headers.has('Authorization')) {
    return next(req);
  }

  const accessToken = storage.getAccessToken();
  if (!accessToken) {
    return next(req);
  }

  const authReq = req.clone({
    setHeaders: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  return next(authReq).pipe(
    catchError((err: unknown) => {
      // Refresh tylko dla 401 i tylko raz na request.
      if (getErrorStatus(err) !== 401) {
        return throwError(() => err);
      }

      if (isAuthEndpoint(req.url)) {
        return throwError(() => err);
      }

      if (req.context.get(SKIP_AUTH_REFRESH)) {
        return throwError(() => err);
      }

      const refreshToken = storage.getRefreshToken();
      if (!refreshToken) {
        return throwError(() => err);
      }

      const refresh$ = getOrStartRefresh(http, storage, refreshToken);

      return refresh$.pipe(
        switchMap((tokens) => {
          const retryReq = req.clone({
            context: req.context.set(SKIP_AUTH_REFRESH, true),
            setHeaders: {
              Authorization: `Bearer ${tokens.accessToken}`
            }
          });
          return next(retryReq);
        }),
        catchError((refreshErr: unknown) => {
          // Jeśli refresh się nie uda, traktujemy to jak wymuszone wylogowanie.
          void signalr.stop().catch(() => {
            // Nie blokuj przez SignalR.
          });
          storage.clear();
          currentUser.clear();

          if (window.location.pathname !== '/auth/login') {
            window.location.href = '/auth/login';
          }

          return throwError(() => refreshErr);
        })
      );
    })
  );
};

const SKIP_AUTH_REFRESH = new HttpContextToken<boolean>(() => false);

let refreshInFlight$: Observable<AuthTokens> | null = null;

function getErrorStatus(err: unknown): number | undefined {
  if (err instanceof HttpErrorResponse) {
    return err.status;
  }

  if (typeof err === 'object' && err !== null && 'status' in err) {
    const status = (err as { status?: unknown }).status;
    return typeof status === 'number' ? status : undefined;
  }

  return undefined;
}

function getOrStartRefresh(
  http: HttpClient,
  storage: AuthTokenStorage,
  refreshToken: string
): Observable<AuthTokens> {
  if (refreshInFlight$) {
    return refreshInFlight$;
  }

  // Ustawiamy IS_API_REQUEST, żeby baseUrl interceptor dokleił API_BASE_URL.
  const context = new HttpContext().set(IS_API_REQUEST, true).set(SKIP_AUTH_REFRESH, true);

  refreshInFlight$ = http
    .post<AuthTokens>('/user/refresh', { refreshToken }, { context })
    .pipe(
      switchMap((tokens) => {
        storage.set(tokens);
        return [tokens];
      }),
      finalize(() => {
        refreshInFlight$ = null;
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );

  return refreshInFlight$;
}
