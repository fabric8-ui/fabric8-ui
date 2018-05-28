import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  HttpModule, Http,
  RequestOptions, XHRBackend } from '@angular/http';
import { RouterModule } from '@angular/router';

import {
  BsDropdownConfig,
  BsDropdownModule,
  CollapseModule,
  TooltipConfig,
  TooltipModule,
} from 'ngx-bootstrap';
import { AuthenticationService } from 'ngx-login-client';

import { CommentModule } from './../../widgets/comment-module/comment.module';
import { GlobalSettings } from './../../shared/globals';
import { HttpService } from './../../services/http-service';
import { SafePipeModule } from '../../pipes/safe.module';
import {
  AlmEditableModule,
  AlmIconModule,
  WidgetsModule,
  MarkdownModule
} from 'ngx-widgets';

import { WorkItemCommentComponent } from './work-item-comment.component';
import { PlannerModalModule } from './../../components/modal/modal.module';

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
    CommentModule,
    BsDropdownModule,
    FormsModule,
    MarkdownModule,
    PlannerModalModule,
    RouterModule,
    HttpModule,
    TooltipModule,
    WidgetsModule,
    SafePipeModule
  ],
  declarations: [
    WorkItemCommentComponent
   ],
  exports: [ WorkItemCommentComponent ],
  providers: providers
})
export class WorkItemCommentModule { }
