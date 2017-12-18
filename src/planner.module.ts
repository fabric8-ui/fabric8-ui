import { NgModule } from '@angular/core';

import { PlannerBoardModule } from './app/components/planner-board/planner-board.module';
import { PlannerListModule } from './app/components/planner-list/planner-list.module';

import { StoreModule } from '@ngrx/store';

@NgModule({
  imports: [StoreModule.forRoot({})
  ],
  declarations: [
  ],
  exports: [
    PlannerBoardModule,
    PlannerListModule
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
