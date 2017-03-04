import { NgModule } from '@angular/core';

import { WorkItemModule } from './src/app/work-item/work-item.module';
import { PlannerBoardModule } from './src/app/work-item/work-item-board/planner-board.module';
import { PlannerListModule } from './src/app/work-item/work-item-list/planner-list.module';


@NgModule({
  imports: [
  ],
  declarations: [
  ],
  exports: [
    PlannerBoardModule,
    PlannerListModule,
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