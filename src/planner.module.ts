import { NgModule } from '@angular/core';

import { PlannerBoardModule } from './app/components/planner-board/planner-board.module';
import { PlannerListModule } from './app/components/planner-list/planner-list.module';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { AppState } from './app/states/app.state';
import { IterationState } from './app/states/iteration.state';
import { iterationReducer } from './app/reducers/iteration-reducer';
import { LabelReducer } from './app/reducers/label.reducer';
import { AreaReducer } from './app/reducers/area.reducer';
import { CollaboratorReducer } from './app/reducers/collaborator.reducer';
import { IterationEffects } from './app/effects/iteration.effects';
import { LabelEffects } from './app/effects/label.effects';
import { AreaEffects } from './app/effects/area.effects';
import { CollaboratorEffects } from './app/effects/collaborator.effects';
import { CommentEffects } from './app/effects/comment.effects';
import { CommentReducer } from './app/reducers/comment.reducer';


@NgModule({
  imports: [StoreModule.forRoot({
    iterations : iterationReducer,
    labels: LabelReducer,
    areas: AreaReducer,
    collaborators: CollaboratorReducer,
    comments: CommentReducer
  }),
    EffectsModule.forRoot([
      IterationEffects,
      LabelEffects,
      AreaEffects,
      CollaboratorEffects,
      CommentEffects
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
