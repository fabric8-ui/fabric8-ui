
import { RouterModule } from '@angular/router';
import { NgModule }     from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { HttpModule, Http }    from '@angular/http';

import { CollapseModule } from 'ng2-bootstrap';
import { Ng2CompleterModule } from 'ng2-completer';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { MyDatePickerModule } from 'mydatepicker';

import { MockHttp } from '../../mock/mock-http';

import { AlmUserName } from '../../pipes/alm-user-name.pipe';

import {
  AlmEditableModule,
  AlmIconModule,
  WidgetsModule,
  MarkdownModule
} from 'ngx-widgets';
import { ModalModule } from 'ngx-modal';

import { AreaService } from '../../services/area.service';
import { WorkItemDetailComponent } from './work-item-detail.component';
import { DynamicFieldComponent } from '../dynamic-field/dynamic-field.component';
import { TypeaheadDropdown } from '../typeahead-dropdown/typeahead-dropdown.component';
import { MarkdownControlComponent } from '../markdown-control/markdown-control.component';
import { WorkItemLinkModule } from '../work-item-link/work-item-link.module';
import { WorkItemCommentModule } from '../work-item-comment/work-item-comment.module';
import { WorkItemTypeControlService } from '../../services/work-item-type-control.service';

let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [ AreaService, BsDropdownConfig, TooltipConfig, WorkItemTypeControlService, { provide: Http, useExisting: MockHttp } ];
} else {
  providers = [ AreaService, BsDropdownConfig, TooltipConfig, WorkItemTypeControlService ];
}

@NgModule({
  imports: [
    BsDropdownModule.forRoot(),
    HttpModule,
    WidgetsModule,
    AlmIconModule,
    AlmEditableModule,
    ModalModule,
    CommonModule,
    CollapseModule,
    FormsModule,
    TooltipModule.forRoot(),
    Ng2CompleterModule,
    ReactiveFormsModule,
    MarkdownModule,
    MyDatePickerModule,
    RouterModule,
    WorkItemLinkModule,
    WorkItemCommentModule
  ],
  declarations: [
    AlmUserName,
    WorkItemDetailComponent,
    DynamicFieldComponent,
    MarkdownControlComponent,
    TypeaheadDropdown
  ],
  exports: [WorkItemDetailComponent, AlmUserName],
  providers: providers
})
export class WorkItemDetailModule { }
