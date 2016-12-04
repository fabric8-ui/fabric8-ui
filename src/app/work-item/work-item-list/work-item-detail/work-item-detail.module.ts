import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DropdownModule } from 'ng2-dropdown';
import { Ng2CompleterModule } from 'ng2-completer';

import { AlmIconModule } from './../../../shared-component/icon/almicon.module';
import { AlmEditableModule } from './../../../shared-component/editable/almeditable.module';
import { WorkItemDetailComponent } from './work-item-detail.component';
import { WorkItemLinkComponent } from './work-item-link/work-item-link.component';
import { WorkItemLinkService } from './work-item-link/work-item-link.service';
import { WorkItemCommentComponent } from './work-item-comment/work-item-comment.component';
import { WorkItemCommentService } from './work-item-comment/work-item-comment.service';
//Pipes
import { AlmTrim } from './../../../pipes/alm-trim';
import { AlmSearchHighlight } from './../../../pipes/alm-search-highlight.pipe';
import { AlmLinkTarget } from './../../../pipes/alm-link-target.pipe';
import { AlmAvatarSize } from './../../../pipes/alm-avatar-size.pipe';


@NgModule({
  imports: [
    AlmIconModule,
    AlmEditableModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    Ng2CompleterModule
  ],
  declarations: [WorkItemDetailComponent, AlmTrim, AlmSearchHighlight, AlmLinkTarget, AlmAvatarSize, WorkItemLinkComponent, WorkItemCommentComponent],
  exports: [WorkItemDetailComponent],
  providers: [WorkItemLinkService, WorkItemCommentService]
})
export class WorkItemDetailModule { }