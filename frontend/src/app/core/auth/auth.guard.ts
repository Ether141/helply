import { CanMatchFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { TimeoutError, catchError, map, of, take, timeout } from 'rxjs';

import { ApiError } from '../api/api-error';
import { AuthTokenStorage } from './auth-token.storage';
import { CurrentUserService } from './current-user.service';
import { SignalrService } from '../services/signalr.service';

export const authGuard: CanMatchFn = (_route, segments) => {
  const router = inject(Router);
  const tokenStorage = inject(AuthTokenStorage);
  const currentUser = inject(CurrentUserService);
  const signalr = inject(SignalrService);

  if (segments[0]?.path === 'auth') {
    return false;
  }

  const accessToken = tokenStorage.getAccessToken();
  if (!accessToken) {
    void signalr.stop().catch(() => {
      // Guard nie powinien failować przez SignalR.
    });
    return router.parseUrl('/auth/login');
  }

  return currentUser.refresh().pipe(
    take(1),
    timeout({ first: 4000 }),
    map((user) => {
      if (user) {
        return true;
      }

      void signalr.stop().catch(() => {
        // Wylogowanie wymuszone.
      });
      tokenStorage.clear();
      currentUser.clear();
      return router.parseUrl('/auth/login');
    }),
    catchError((err: unknown) => {
      const status = (err as ApiError | undefined)?.status;

      if (err instanceof TimeoutError || status === 0 || status === 401 || status === 403) {
        void signalr.stop().catch(() => {
          // Wylogowanie wymuszone.
        });
        tokenStorage.clear();
        currentUser.clear();
      }
      return of(router.parseUrl('/auth/login'));
    })
  );
};
