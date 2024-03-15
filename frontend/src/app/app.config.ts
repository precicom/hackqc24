import { ApplicationConfig, LOCALE_ID, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { TranslateModule } from '@ngx-translate/core';
import { IMAGE_LOADER, ImageLoaderConfig } from '@angular/common';
import { environment } from '../environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations'

export const appConfig: ApplicationConfig = {
  providers: [
    
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
    importProvidersFrom(TranslateModule.forRoot({ useDefaultLang: false })),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }, 
    { provide: LOCALE_ID, useValue: 'fr-CA' },
    {
      provide: IMAGE_LOADER,
      useValue: (config: ImageLoaderConfig) => {
        return `${environment.apiUrl}${config.src}`;
      },
    },
    
  ]
};
