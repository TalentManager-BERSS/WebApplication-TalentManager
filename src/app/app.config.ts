import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { MatPaginatorIntl } from '@angular/material/paginator';
import { createCustomPaginatorIntl } from '../../public/i18n/custom-paginator-intl';

const httpLoaderFactory: (http: HttpClient) => TranslateLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(routes),
    {
      provide: MatPaginatorIntl,
      useFactory: createCustomPaginatorIntl
    },
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en'
    })
  ]
};
