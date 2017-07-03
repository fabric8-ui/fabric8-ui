// The usual bootstrapping imports
import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
//import './../../dist-watch/assets/stylesheets/shared/main.css';
//import './../../dist-watch/assets/stylesheets/planner-overrides.css';

if (process.env.ENV === 'production') {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
