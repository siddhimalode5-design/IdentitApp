import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import {withFetch } from '@angular/common/http';
 
 
import {  withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
 
 
 

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
     provideAnimationsAsync(),
       provideHttpClient(withFetch()),
                providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } })

         
       
       
 
  ]

};
