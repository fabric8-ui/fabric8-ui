import { NgModule } from '@angular/core';

import { PlannerBoardModule } from './app/components/planner-board/planner-board.module';
import { PlannerListModule } from './app/components/planner-list/planner-list.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import * as reducers from './app/reducers/index.reducer';
import  * as effects from './app/effects/index.effects';

@NgModule({
  imports: [StoreModule.forRoot({
    iterations : reducers.iterationReducer,
    labels: reducers.LabelReducer,
    areas: reducers.AreaReducer,
    collaborators: reducers.CollaboratorReducer,
    comments: reducers.CommentReducer,
    workItems: reducers.WorkItemReducer,
    infotips: reducers.InfotipReducer,
    events: reducers.EventReducer
  }),
    EffectsModule.forRoot([
      effects.IterationEffects,
      effects.LabelEffects,
      effects.AreaEffects,
      effects.CollaboratorEffects,
      effects.CommentEffects,
      effects.WorkItemEffects,
      effects.InfotipEffects,
      effects.EventEffects
    ])
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
