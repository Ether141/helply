import { HttpClient, HttpContext, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiParams, toHttpParams } from './http-params.util';
import { IS_API_REQUEST } from './api.context';

export interface ApiRequestOptions {
  headers?: Record<string, string>;
  params?: ApiParams;
  context?: HttpContext;
  withCredentials?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ApiClient {
  private readonly http = inject(HttpClient);

  private apiContext(context?: HttpContext): HttpContext {
    return (context ?? new HttpContext()).set(IS_API_REQUEST, true);
  }

  get<T>(url: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.get<T>(url, {
      headers: options?.headers ? new HttpHeaders(options.headers) : undefined,
      params: toHttpParams(options?.params),
      context: this.apiContext(options?.context),
      withCredentials: options?.withCredentials
    });
  }

  post<T>(url: string, body?: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http.post<T>(url, body ?? null, {
      headers: options?.headers ? new HttpHeaders(options.headers) : undefined,
      params: toHttpParams(options?.params),
      context: this.apiContext(options?.context),
      withCredentials: options?.withCredentials
    });
  }

  put<T>(url: string, body?: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http.put<T>(url, body ?? null, {
      headers: options?.headers ? new HttpHeaders(options.headers) : undefined,
      params: toHttpParams(options?.params),
      context: this.apiContext(options?.context),
      withCredentials: options?.withCredentials
    });
  }

  patch<T>(url: string, body?: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http.patch<T>(url, body ?? null, {
      headers: options?.headers ? new HttpHeaders(options.headers) : undefined,
      params: toHttpParams(options?.params),
      context: this.apiContext(options?.context),
      withCredentials: options?.withCredentials
    });
  }

  delete<T>(url: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.delete<T>(url, {
      headers: options?.headers ? new HttpHeaders(options.headers) : undefined,
      params: toHttpParams(options?.params),
      context: this.apiContext(options?.context),
      withCredentials: options?.withCredentials
    });
  }

  /** Gdy potrzebujesz status/headers (np. dla paginacji). */
  getResponse<T>(url: string, options?: ApiRequestOptions): Observable<HttpResponse<T>> {
    return this.http.get<T>(url, {
      observe: 'response',
      headers: options?.headers ? new HttpHeaders(options.headers) : undefined,
      params: toHttpParams(options?.params),
      context: this.apiContext(options?.context),
      withCredentials: options?.withCredentials
    });
  }
}
