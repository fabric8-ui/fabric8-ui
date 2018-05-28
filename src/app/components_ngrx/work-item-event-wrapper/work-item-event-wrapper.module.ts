import { NgModule } from "@angular/core";
import { WorkItemEventWrapperComponent } from "./work-item-event-wrapper.component";
import { WorkItemEventModule } from "../work-item-event/work-item-event.module";
import { CommonModule } from "@angular/common";
import { CollapseModule } from 'ngx-bootstrap';
import { GlobalSettings } from "../../shared/globals";
import { HttpService } from './../../services/http-service';
import { HttpModule, Http, XHRBackend, RequestOptions } from '@angular/http';
import { AuthenticationService } from 'ngx-login-client';
import { MockHttp } from '../../mock/mock-http';
import { EventQuery } from "../../models/event.model";
import { EmptyStateModule } from "patternfly-ng/empty-state";

@NgModule({
  imports: [    
    CommonModule,
    CollapseModule,
    EmptyStateModule,
    WorkItemEventModule],
  declarations: [WorkItemEventWrapperComponent],
  exports: [WorkItemEventWrapperComponent],
  providers: [EventQuery]
})

export class WorkItemEventWrapperModule { }