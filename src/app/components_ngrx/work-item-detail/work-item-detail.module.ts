import { AuthenticationService } from 'ngx-login-client';
import { RouterModule } from '@angular/router';
import { InlineInputModule } from './../../widgets/inlineinput/inlineinput.module';
import { WidgetsModule } from 'ngx-widgets';
import { FormsModule } from '@angular/forms';
import { UserMapper } from './../../models/user';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { WorkItemDetailComponent } from './work-item-detail.component';
import { WorkItemDetailRoutingModule } from './work-item-detail-routing.module';

// ngrx stuff
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CommentState, initialState as initialCommentState } from './../../states/comment.state';
import { CommentReducer } from './../../reducers/comment.reducer';
import { CommentEffects } from './../../effects/comment.effects';
import {
  DetailWorkItemState,
  initialState as initialDetailWIState
} from './../../states/detail-work-item.state';
import { DetailWorkItemReducer } from './../../reducers/detail-work-item.reducer';
import { DetailWorkItemEffects } from './../../effects/detail-work-item.effects';
import { UrlService } from '../../services/url.service';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    WidgetsModule,
    InlineInputModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    StoreModule.forFeature('detailPage', {
      comments: CommentReducer,
      workItem: DetailWorkItemReducer
    }, {
      initialState: {
        comments: initialCommentState,
        workItem: initialDetailWIState
      }
    }),
    EffectsModule.forFeature([
      CommentEffects,
      DetailWorkItemEffects
    ])
  ],
  providers: [
    UserMapper,
    UrlService,
    BsDropdownConfig,
    AuthenticationService
  ],
  declarations: [
    WorkItemDetailComponent
  ],
  exports: [
    WorkItemDetailComponent
  ]
})
export class WorkItemDetailModule {}
