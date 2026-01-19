import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';

import { API_BASE_URL } from './api.tokens';
import { IS_API_REQUEST } from './api.context';
import { toApiError } from './api-error';

function isAbsoluteUrl(url: string): boolean {
  return /^https?:\/\//i.test(url) || url.startsWith('//');
}

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.context.get(IS_API_REQUEST)) {
    return next(req);
  }

  if (isAbsoluteUrl(req.url)) {
    return next(req);
  }

  const baseUrl = inject(API_BASE_URL, { optional: true }) ?? '';
  if (!baseUrl) {
    return next(req);
  }

  const normalizedBase = baseUrl.replace(/\/+$/, '');
  const normalizedUrl = req.url.replace(/^\/+/, '');
  const url = normalizedUrl ? `${normalizedBase}/${normalizedUrl}` : normalizedBase;

  return next(req.clone({ url }));
};

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(catchError((err: unknown) => throwError(() => toApiError(err))));
};
