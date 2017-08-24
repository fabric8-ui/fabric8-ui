import { AuthenticationService } from 'ngx-login-client';
import { WidgetsModule, InlineInputModule } from 'ngx-widgets';
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

import { MockHttp } from './../../mock/mock-http';

import { WorkItemNewDetailComponent } from './work-item-new-detail.component';
import { WorkItemNewDetailRoutingModule } from './work-item-new-detail-routing.module';



let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [
    {
      provide: Http, useExisting: MockHttp
    },
    AreaService,
    IterationService,
    WorkItemDataService,
    WorkItemService,
    WorkItemTypeControlService
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
    IterationService,
    WorkItemDataService,
    WorkItemService,
    WorkItemTypeControlService
  ];
}

@NgModule({
  imports: [
    HttpModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    WidgetsModule,
    WorkItemNewDetailRoutingModule,
    WorkItemLinkModule,
    InlineInputModule
  ],
  declarations: [
    WorkItemNewDetailComponent
  ],
  exports: [WorkItemNewDetailComponent],
  providers: providers
})
export class WorkItemNewDetailModule { }
