// The usual bootstrapping imports
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

import './assets/stylesheets/shared/main.scss';
import './assets/stylesheets/planner-overrides.scss';

if (process.env.ENV === 'production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
