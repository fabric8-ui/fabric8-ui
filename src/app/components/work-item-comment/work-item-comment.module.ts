import { GlobalSettings } from '../../shared/globals';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { HttpService } from './../../services/http-service';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CollapseModule } from 'ng2-bootstrap';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ModalModule } from 'ngx-modal';
import {
  AlmEditableModule,
  AlmIconModule,
  WidgetsModule,
  MarkdownModule
} from 'ngx-widgets';

import { WorkItemCommentComponent } from './work-item-comment.component';

import { MockHttp } from '../../mock/mock-http';


let providers = [];

if (process.env.ENV == 'inmemory') {
  providers = [
    GlobalSettings,
    {
      provide: HttpService,
      useExisting: MockHttp
     },
    TooltipConfig,
    BsDropdownConfig
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
    GlobalSettings,
    TooltipConfig,
    BsDropdownConfig
    ];
}

@NgModule({
  imports: [
    AlmEditableModule,
    AlmIconModule,
    CollapseModule,
    CommonModule,
    BsDropdownModule,
    FormsModule,
    MarkdownModule,
    ModalModule,
    RouterModule,
    HttpModule,
    TooltipModule,
    WidgetsModule
  ],
  declarations: [
    WorkItemCommentComponent
   ],
  exports: [ WorkItemCommentComponent ],
  providers: providers
})
export class WorkItemCommentModule { }
