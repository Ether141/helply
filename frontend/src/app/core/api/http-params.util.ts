import { HttpParams } from '@angular/common/http';

export type ApiParamPrimitive = string | number | boolean | null | undefined;
export type ApiParamValue = ApiParamPrimitive | ApiParamPrimitive[];
export type ApiParams = Record<string, ApiParamValue>;

export function toHttpParams(params?: ApiParams): HttpParams {
  let httpParams = new HttpParams();

  if (!params) {
    return httpParams;
  }

  for (const [key, rawValue] of Object.entries(params)) {
    if (rawValue === undefined || rawValue === null) {
      continue;
    }

    const values = Array.isArray(rawValue) ? rawValue : [rawValue];

    for (const v of values) {
      if (v === undefined || v === null) {
        continue;
      }

      httpParams = httpParams.append(key, String(v));
    }
  }

  return httpParams;
}
