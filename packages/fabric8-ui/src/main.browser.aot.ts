/*
 * Angular bootstraping
 */
import { platformBrowser } from '@angular/platform-browser';
import { bootloader } from '@angularclass/hmr';

/*
 * App Module
 * our top level module that holds all of our components
 */
import { AppModuleNgFactory } from '../aot/app/app.module.ngfactory';
import { decorateModuleRef } from './app/environment';

/*
 * Bootstrap our Angular app with a top level NgModule
 */
export function main(): Promise<any> {
  return platformBrowser()
    .bootstrapModuleFactory(AppModuleNgFactory)
    .then(decorateModuleRef)
    .catch((err) => console.error(err));
}

// needed for hmr
// in prod this is replace for document ready
bootloader(main);
