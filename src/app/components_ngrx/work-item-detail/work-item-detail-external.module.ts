import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { Http, RequestOptions, XHRBackend } from '@angular/http';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { AuthenticationService } from 'ngx-login-client';
import { HttpBackendClient } from '../../services/httpbackendclient.service';
import { AreaService } from './../../services/area.service';
import { CollaboratorService } from './../../services/collaborator.service';
import { factoryForHttpService, HttpService } from './../../services/http-service';
import { IterationService } from './../../services/iteration.service';
import { LabelService } from './../../services/label.service';
import { WorkItemService } from './../../services/work-item.service';
import { GlobalSettings } from './../../shared/globals';
import { WorkItemDetailRoutingModule } from './work-item-detail-routing.module';
import { WorkItemDetailModule } from './work-item-detail.module';

let providers = [
  AreaService,
  WorkItemService,
  GlobalSettings,
  IterationService,
  LabelService,
  TooltipConfig,
  CollaboratorService,
  {
    provide: HttpService,
    useFactory: factoryForHttpService,
    deps: [XHRBackend, RequestOptions, AuthenticationService]
  },
  HttpBackendClient
];

@NgModule({
  imports: [
    WorkItemDetailRoutingModule,
    WorkItemDetailModule,
    TooltipModule,
    HttpClientModule
  ],
  providers: providers
})
export class WorkItemDetailExternalModule {

}
