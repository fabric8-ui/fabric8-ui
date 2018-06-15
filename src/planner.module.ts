import { NgModule } from '@angular/core';

import { PlannerBoardModule } from './app/components_ngrx/planner-board/planner-board.module';
import { PlannerListModule } from './app/components_ngrx/planner-list/planner-list.module';

import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import  * as effects from './app/effects/index.effects';
import * as reducers from './app/reducers/index.reducer';

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
    PlannerListModule,
    PlannerBoardModule
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
