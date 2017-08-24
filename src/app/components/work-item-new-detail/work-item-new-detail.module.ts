import { AuthenticationService } from 'ngx-login-client';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { WidgetsModule, InlineInputModule, MarkdownModule } from 'ngx-widgets';
import { HttpService } from './../../services/http-service';
import { WorkItemTypeControlService } from './../../services/work-item-type-control.service';
import { WorkItemService } from './../../services/work-item.service';
import { WorkItemDataService } from './../../services/work-item-data.service';
import { IterationService } from './../../services/iteration.service';
import { AreaService } from './../../services/area.service';
import { WorkItemLinkModule } from './../work-item-link/work-item-link.module';
import { CommonModule } from '@angular/common';
import { NgModule }     from '@angular/core';
import { FormsModule, ReactiveFormsModule }  from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';

import { MockHttp } from './../../mock/mock-http';

import { WorkItemNewDetailComponent } from './work-item-new-detail.component';
import { WorkItemNewDetailRoutingModule } from './work-item-new-detail-routing.module';
import { WorkItemCommentModule } from '../work-item-comment/work-item-comment.module';
import { CollaboratorService } from '../../services/collaborator.service'
import { TypeaheadDropDownModule } from '../typeahead-dropdown/typeahead-dropdown.module';

import { AlmUserNameModule } from '../../pipes/alm-user-name.module';



let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [
    {
      provide: Http, useExisting: MockHttp
    },
    AreaService,
    BsDropdownConfig,
    IterationService,
    TooltipConfig,
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
    BsDropdownConfig,
    IterationService,
    TooltipConfig,
    WorkItemDataService,
    WorkItemService,
    WorkItemTypeControlService,
    CollaboratorService
  ];
}

@NgModule({
  imports: [
    AlmUserNameModule,
    BsDropdownModule.forRoot(),
    HttpModule,
    CommonModule,
    FormsModule,
    MarkdownModule,
    ReactiveFormsModule,
    RouterModule,
    TooltipModule,
    TypeaheadDropDownModule,
    WidgetsModule,
    WorkItemNewDetailRoutingModule,
    WorkItemLinkModule,
    InlineInputModule,
    WorkItemCommentModule
  ],
  declarations: [
    WorkItemNewDetailComponent
  ],
  exports: [WorkItemNewDetailComponent],
  providers: providers
})
export class WorkItemNewDetailModule { }
