import { HttpErrorResponse } from '@angular/common/http';

export type ApiErrorKind = 'http' | 'network' | 'unknown';

export interface ApiError {
  kind: ApiErrorKind;
  message: string;
  status?: number;
  url?: string;
  /** Oryginalny błąd (np. HttpErrorResponse) */
  cause?: unknown;
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof HttpErrorResponse) {
    // Sieć / CORS / DNS / offline: status = 0
    const isNetwork = error.status === 0;
    const kind: ApiErrorKind = isNetwork ? 'network' : 'http';

    // Backend często zwraca { message } lub string; fallback na statusText
    const backendMessage =
      typeof error.error === 'string'
        ? error.error
        : (error.error as { message?: unknown } | null | undefined)?.message;

    const message =
      (typeof backendMessage === 'string' && backendMessage.trim().length > 0
        ? backendMessage
        : error.message || error.statusText || 'Request failed');

    return {
      kind,
      message,
      status: error.status,
      url: error.url ?? undefined,
      cause: error
    };
  }

  if (error instanceof Error) {
    return {
      kind: 'unknown',
      message: error.message,
      cause: error
    };
  }

  return {
    kind: 'unknown',
    message: 'Unknown error',
    cause: error
  };
}
