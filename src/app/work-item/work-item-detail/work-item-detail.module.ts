import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule }  from '@angular/forms';

import { CollapseModule, TooltipModule } from 'ng2-bootstrap';
import { Ng2CompleterModule } from 'ng2-completer';
import { DropdownModule } from 'ng2-bootstrap';

import { AlmUserName } from '../../pipes/alm-user-name.pipe';

import {
  AlmEditableModule,
  AlmIconModule,
  WidgetsModule
} from 'ngx-widgets';

import { AreaService } from '../../area/area.service';
import { WorkItemDetailComponent } from './work-item-detail.component';
import { WorkItemLinkComponent } from './work-item-link/work-item-link.component';
import { WorkItemCommentComponent } from './work-item-comment/work-item-comment.component';
import {
  WorkItemLinkFilterByTypeName,
  WorkItemLinkTypeFilterByTypeName
} from './work-item-detail-pipes/work-item-link-filters.pipe';


@NgModule({
  imports: [
    WidgetsModule,
    AlmIconModule,
    AlmEditableModule,
    CommonModule,
    CollapseModule,
    DropdownModule,
    FormsModule,
    TooltipModule,
    Ng2CompleterModule
  ],
  declarations: [
    AlmUserName,
    WorkItemCommentComponent,
    WorkItemDetailComponent,
    WorkItemLinkComponent,
    WorkItemLinkFilterByTypeName,
    WorkItemLinkTypeFilterByTypeName
  ],
  exports: [WorkItemDetailComponent],
  providers: [
    AreaService
  ]
})
export class WorkItemDetailModule { }
