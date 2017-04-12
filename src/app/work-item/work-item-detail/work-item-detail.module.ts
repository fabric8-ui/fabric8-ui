import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { HttpModule, Http }    from '@angular/http';

import { CollapseModule, TooltipModule } from 'ng2-bootstrap';
import { Ng2CompleterModule } from 'ng2-completer';
import { DropdownModule } from 'ng2-bootstrap';
import { MyDatePickerModule } from 'mydatepicker';

import { MockHttp } from './../../shared/mock-http';

import { AlmUserName } from '../../pipes/alm-user-name.pipe';

import {
  AlmEditableModule,
  AlmIconModule,
  WidgetsModule
} from 'ngx-widgets';

import { ModalModule } from 'ngx-modal';

import { AreaService } from '../../area/area.service';
import { WorkItemDetailComponent } from './work-item-detail.component';
import { DynamicFieldComponent } from './dynamic-form/dynamic-field.component';
import { TypeaheadDropdown } from './typeahead-dropdown/typeahead-dropdown.component';
import { MarkdownControlComponent } from './markdown-control/markdown-control.component';
import { WorkItemLinkComponent } from './work-item-link/work-item-link.component';
import { WorkItemCommentComponent } from './work-item-comment/work-item-comment.component';
import {
  WorkItemLinkFilterByTypeName,
  WorkItemLinkTypeFilterByTypeName
} from './work-item-detail-pipes/work-item-link-filters.pipe';
import { WorkItemTypeControlService } from '../work-item-type-control.service';

let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [ AreaService, WorkItemTypeControlService, { provide: Http, useExisting: MockHttp } ];
} else {
  providers = [ AreaService, WorkItemTypeControlService ];
}

@NgModule({
  imports: [
    HttpModule,
    WidgetsModule,
    AlmIconModule,
    AlmEditableModule,
    ModalModule,
    CommonModule,
    CollapseModule,
    DropdownModule,
    FormsModule,
    TooltipModule,
    Ng2CompleterModule,
    ReactiveFormsModule,
    MyDatePickerModule
  ],
  declarations: [
    AlmUserName,
    WorkItemCommentComponent,
    WorkItemDetailComponent,
    DynamicFieldComponent,
    TypeaheadDropdown,
    MarkdownControlComponent,
    WorkItemLinkComponent,
    WorkItemLinkFilterByTypeName,
    WorkItemLinkTypeFilterByTypeName
  ],
  exports: [WorkItemDetailComponent, AlmUserName],
  providers: providers
})
export class WorkItemDetailModule { }
