import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { catchError, map, of, take } from 'rxjs';

import { CurrentUserService } from './current-user.service';

export const createTicketGuard: CanMatchFn = () => {
  const router = inject(Router);
  const currentUser = inject(CurrentUserService);

  const role = currentUser.snapshot?.role ?? null;
  if (role) {
    return role === 'Assistant' ? router.parseUrl('/tickets') : true;
  }

  return currentUser.refresh().pipe(
    take(1),
    map((user) => (user?.role === 'Assistant' ? router.parseUrl('/tickets') : true)),
    catchError(() => of(router.parseUrl('/tickets')))
  );
};
