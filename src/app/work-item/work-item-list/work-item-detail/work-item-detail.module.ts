import { AlmUserName } from './../../../pipes/alm-user-name.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'ng2-dropdown';
import { Ng2CompleterModule } from 'ng2-completer';

import { AlmIconModule } from '../../../shared-component/icon/almicon.module';
import { AlmEditableModule } from '../../../shared-component/editable/almeditable.module';

//Pipes
import { AlmAvatarSize } from '../../../pipes/alm-avatar-size.pipe';
import { AlmLinkTarget } from '../../../pipes/alm-link-target.pipe';
import { AlmMomentTime } from '../../../pipes/alm-moment-time.pipe';
import { AlmSearchHighlight } from '../../../pipes/alm-search-highlight.pipe';
import { AlmTrim } from '../../../pipes/alm-trim';

import { WorkItemDetailComponent } from './work-item-detail.component';
import { WorkItemLinkComponent } from './work-item-link/work-item-link.component';
import { WorkItemCommentComponent } from './work-item-comment/work-item-comment.component';
import {
  WorkItemLinkFilterByTypeName,
  WorkItemLinkTypeFilterByTypeName,
  AlmValidLinkTypes
} from './work-item-detail-pipes/work-item-link-filters.pipe';


@NgModule({
  imports: [
    AlmIconModule,
    AlmEditableModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    Ng2CompleterModule
  ],
  declarations: [
    AlmAvatarSize,
    AlmLinkTarget,
    AlmMomentTime,
    AlmSearchHighlight,
    AlmTrim,
    AlmUserName,
    AlmValidLinkTypes,
    WorkItemCommentComponent,
    WorkItemDetailComponent,
    WorkItemLinkComponent,
    WorkItemLinkFilterByTypeName,
    WorkItemLinkTypeFilterByTypeName
  ],
  exports: [WorkItemDetailComponent],
  providers: []
})
export class WorkItemDetailModule { }