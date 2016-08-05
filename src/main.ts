// Imports for loading & configuring the in-memory web api
import { XHRBackend } from '@angular/http';

import { InMemoryBackendService, SEED_DATA } from 'angular2-in-memory-web-api';
import { InMemoryDataService }               from './app/in-memory-data.service';

// The usual bootstrapping imports
import { bootstrap }      from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';
import { enableProdMode } from '@angular/core';

import { AppComponent }         from './app/app.component';
import { appRouterProviders }   from './app/app.routes';

if (process.env.ENV === 'production') {
  enableProdMode();
}

bootstrap(AppComponent, [
  appRouterProviders,
  HTTP_PROVIDERS,
  { provide: XHRBackend, useClass: InMemoryBackendService }, // in-mem server
  { provide: SEED_DATA, useClass: InMemoryDataService }      // in-mem server data
]);
