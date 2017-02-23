import { NgModule } from '@angular/core';

import { WorkItemModule } from './src/app/work-item/work-item.module';


@NgModule({
  imports: [
  ],
  declarations: [
  ],
  exports: [
    WorkItemModule
  ]
})
export class PlannerModule {
  // static forRoot(providedLoader: any = {
  //   provide: TranslateLoader,
  //   useFactory: translateLoaderFactory,
  //   deps: [Http]
  // }): ModuleWithProviders {
  //   return {
  //     ngModule: WidgetsModule,
  //     providers: [
  //       providedLoader,
  //       TranslateService,
  //       { provide: TranslateParser, useClass: DefaultTranslateParser }
  //     ]
  //   };
  // }
}