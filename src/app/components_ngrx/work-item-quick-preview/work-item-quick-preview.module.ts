import { UserMapper } from './../../models/user';
import { LabelSelectorModule } from './../label-selector/label-selector.module';

import { RouterModule } from '@angular/router';
import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { HttpModule, Http }    from '@angular/http';

import { CollapseModule } from 'ngx-bootstrap';
import { Ng2CompleterModule } from 'ng2-completer';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { MyDatePickerModule } from 'mydatepicker';

import { MockHttp } from '../../mock/mock-http';

import { AlmUserNameModule } from '../../pipes/alm-user-name.module';

import {
  AlmIconModule,
  WidgetsModule,
  MarkdownModule
} from 'ngx-widgets';
import { ModalModule } from 'ngx-modal';

import { AreaService } from '../../services/area.service';
import { InlineInputModule } from './../../widgets/inlineinput/inlineinput.module';
import { WorkItemQuickPreviewComponent } from './work-item-quick-preview.component';
// import { DynamicFieldComponent } from './../../components/dynamic-field/dynamic-field.component';
import { TypeaheadDropDownModule } from './../../components/typeahead-dropdown/typeahead-dropdown.module';
import { LabelsModule } from '../labels/labels.module';
import { WorkItemLinkModule } from './../../components/work-item-link/work-item-link.module';
import { WorkItemCommentModule } from './../work-item-comment/work-item-comment.module';
import { WorkItemTypeControlService } from '../../services/work-item-type-control.service';
import { SelectDropdownModule } from './../../widgets/select-dropdown/select-dropdown.module';
import { AssigneesModule } from './../assignee/assignee.module';
import { AssigneeSelectorModule } from './../assignee-selector/assignee-selector.module';

//ngrx stuff
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

let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [ AreaService, BsDropdownConfig, TooltipConfig, WorkItemTypeControlService, { provide: Http, useExisting: MockHttp }, UserMapper ];
} else {
  providers = [ AreaService, BsDropdownConfig, TooltipConfig, WorkItemTypeControlService, UserMapper ];
}

@NgModule({
  imports: [
    AlmUserNameModule,
    AssigneesModule,
    AssigneeSelectorModule,
    BsDropdownModule.forRoot(),
    HttpModule,
    InlineInputModule,
    WidgetsModule,
    AlmIconModule,
    LabelSelectorModule,
    ModalModule,
    CommonModule,
    CollapseModule,
    FormsModule,
    LabelsModule,
    TooltipModule.forRoot(),
    TypeaheadDropDownModule,
    Ng2CompleterModule,
    ReactiveFormsModule,
    MarkdownModule,
    MyDatePickerModule,
    RouterModule,
    SelectDropdownModule,
    WorkItemLinkModule,
    WorkItemCommentModule,
    StoreModule.forFeature('detailPage', {
      comments: CommentReducer,
      workItem: DetailWorkItemReducer
    }, {
      initialState: {
        comments: initialCommentState,
        workItem: initialDetailWIState
      }
    }),
    EffectsModule.forFeature([CommentEffects, DetailWorkItemEffects])
  ],
  declarations: [
    WorkItemQuickPreviewComponent,
    // DynamicFieldComponent
  ],
  exports: [WorkItemQuickPreviewComponent],
  providers: providers
})
export class WorkItemQuickPreviewModule { }
