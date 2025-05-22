import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { PreloadAllModules, provideRouter, withPreloading, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { HttpClient, provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { environment } from '../environments/environment';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader'; 
export function HttpLoaderFactory(httpClient: HttpClient) { 
  return new TranslateHttpLoader(httpClient, environment.url +'/i18n/', '.json');
}

import { InputFileConfig, InputFileModule } from './theme/components/input-file/input-file.module';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';
const config: InputFileConfig = {
  fileAccept: '*'
};

import { progressInterceptor } from 'ngx-progressbar/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideZoneChangeDetection({ eventCoalescing: true }),  
    provideHttpClient(withFetch(), withInterceptors([progressInterceptor])),
    provideRouter(
      routes,
      withViewTransitions(),
      withPreloading(PreloadAllModules),  // comment this line for enable lazy-loading
    ),    
    provideClientHydration(),
    provideAnimationsAsync(),
    
    importProvidersFrom([ 
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      }),
      InputFileModule.forRoot(config)
    ]),
    { provide: OverlayContainer, useClass: CustomOverlayContainer }       
  ]
};
