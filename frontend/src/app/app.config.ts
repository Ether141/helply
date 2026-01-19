import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { IconService } from './core/services/icon.service';
import { environment } from '../environments/environment';
import { API_BASE_URL } from './core/api/api.tokens';
import { apiBaseUrlInterceptor, apiErrorInterceptor } from './core/api/api.interceptors';
import { authInterceptor } from './core/auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideAnimations(),
    { provide: API_BASE_URL, useValue: environment.apiBaseUrl },
    provideHttpClient(withInterceptors([apiBaseUrlInterceptor, authInterceptor, apiErrorInterceptor])),
    provideAppInitializer(() => {
      inject(IconService).registerAll();
    })
  ]
};
