import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withInMemoryScrolling } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app/app';
import { routes } from './app/app.routes';

// You can customize the behavior here if needed
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled' })
    ),
    importProvidersFrom(FormsModule)
  ]
}).catch(err => console.error(err));
