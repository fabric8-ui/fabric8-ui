import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';

//ngrx stuff
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommentState, initialState as initialCommentState } from './../../states/comment.state';
import { CommentReducer } from './../../reducers/comment.reducer';
import { CommentEffects } from './../../effects/comment.effects';
import { WorkItemCommentWrapperComponent } from './work-item-comment-wrapper.component';
import { WorkItemCommentModule } from './../work-item-comment/work-item-comment.module';

@NgModule({
  imports: [
    CommonModule,
    WorkItemCommentModule,
    StoreModule.forFeature('detailPage', {
      comments: CommentReducer
    }, {
      initialState: {
        comments: initialCommentState
      }
    }),
    EffectsModule.forFeature([CommentEffects])
  ],
  declarations: [
    WorkItemCommentWrapperComponent,
  ],
  exports: [WorkItemCommentWrapperComponent],
})
export class WorkItemCommentWrapperModule { }
