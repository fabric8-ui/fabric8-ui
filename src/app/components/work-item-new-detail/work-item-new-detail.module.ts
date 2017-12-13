import { LabelService } from './../../services/label.service';
import { LabelSelectorModule } from './../label-selector/label-selector.module';
import { UrlService } from './../../services/url.service';
import { AuthenticationService } from 'ngx-login-client';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { WidgetsModule, MarkdownModule } from 'ngx-widgets';
import { HttpService } from './../../services/http-service';
import { WorkItemTypeControlService } from './../../services/work-item-type-control.service';
import { WorkItemService } from './../../services/work-item.service';
import { WorkItemDataService } from './../../services/work-item-data.service';
import { InlineInputModule } from './../../widgets/inlineinput/inlineinput.module';
import { IterationService } from './../../services/iteration.service';
import { AreaService } from './../../services/area.service';
import { FilterService } from './../../services/filter.service';
import { WorkItemLinkModule } from './../work-item-link/work-item-link.module';
import { CommonModule } from '@angular/common';
import { NgModule }     from '@angular/core';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { MockHttp } from './../../mock/mock-http';

import { LabelsModule } from '../labels/labels.module';
import { WorkItemNewDetailComponent } from './work-item-new-detail.component';
import { WorkItemNewDetailRoutingModule } from './work-item-new-detail-routing.module';
import { WorkItemCommentModule } from '../work-item-comment/work-item-comment.module';
import { CollaboratorService } from '../../services/collaborator.service'
import { TypeaheadDropDownModule } from '../typeahead-dropdown/typeahead-dropdown.module';

import { AlmUserNameModule } from '../../pipes/alm-user-name.module';
import { PlannerModalModule } from '../modal/modal.module';
import { SelectDropdownModule } from './../../widgets/select-dropdown/select-dropdown.module';
import { AssigneesModule } from './../assignee/assignee.module';
import { AssigneeSelectorModule } from './../assignee-selector/assignee-selector.module';

let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [
    {
      provide: Http, useExisting: MockHttp
    },
    AreaService,
    FilterService,
    BsDropdownConfig,
    IterationService,
    LabelService,
    TooltipConfig,
    UrlService,
    WorkItemDataService,
    WorkItemService,
    WorkItemTypeControlService,
    CollaboratorService
  ];
} else {
  providers = [
    {
      provide: HttpService,
      useFactory: (backend: XHRBackend, options: RequestOptions, auth: AuthenticationService) => {
        return new HttpService(backend, options, auth);
      },
      deps: [XHRBackend, RequestOptions, AuthenticationService]
    },
    AreaService,
    FilterService,
    BsDropdownConfig,
    IterationService,
    LabelService,
    TooltipConfig,
    UrlService,
    WorkItemDataService,
    WorkItemService,
    WorkItemTypeControlService,
    CollaboratorService
  ];
}

@NgModule({
  imports: [
    AlmUserNameModule,
    AssigneesModule,
    AssigneeSelectorModule,
    BsDropdownModule.forRoot(),
    HttpModule,
    CommonModule,
    FormsModule,
    LabelsModule,
    LabelSelectorModule,
    MarkdownModule,
    ReactiveFormsModule,
    RouterModule,
    TooltipModule,
    TypeaheadDropDownModule,
    WidgetsModule,
    WorkItemNewDetailRoutingModule,
    WorkItemLinkModule,
    InlineInputModule,
    SelectDropdownModule,
    WorkItemCommentModule,
    PlannerModalModule
  ],
  declarations: [
    WorkItemNewDetailComponent
  ],
  exports: [WorkItemNewDetailComponent],
  providers: providers
})
export class WorkItemNewDetailModule { }
