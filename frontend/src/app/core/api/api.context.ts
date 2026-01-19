import { HttpContextToken } from '@angular/common/http';

/**
 * Gdy true, interceptor dokleja API_BASE_URL do req.url.
 * Domyślnie false, żeby nie modyfikować requestów do assets itp.
 */
export const IS_API_REQUEST = new HttpContextToken<boolean>(() => false);
