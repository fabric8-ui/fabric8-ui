import './rxjs-extensions';

import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions, XHRBackend } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { DropdownModule } from 'ng2-bootstrap';
import { TabsModule, TooltipModule } from 'ng2-bootstrap';
import { Broadcaster, Logger } from 'ngx-base';
import { Spaces } from 'ngx-fabric8-wit';
import { ModalModule } from 'ngx-modal';
import {
  AuthenticationService,
  UserService,
  HttpService as HttpServiceLGC
} from 'ngx-login-client';

// Shared
import { GlobalSettings } from './shared/globals';
import { SpacesService } from './shared/standalone/spaces.service';
import { authApiUrlProvider } from './shared/standalone/auth-api.provider';
import { ssoApiUrlProvider } from './shared/standalone/sso-api.provider';
import { witApiUrlProvider } from './shared/wit-api.provider';

// App components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Footer
import { FooterComponent } from './footer/footer.component';

// Header
import { HeaderComponent } from './header/header.component';
import { DummySpace } from './header/DummySpace.service';

// Login
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';

// import { WorkItemModule } from './work-item/work-item.module';
import { PlannerBoardModule } from './work-item/work-item-board/planner-board.module';
import { PlannerListModule } from './work-item/work-item-list/planner-list.module';
import { WorkItemQuickAddModule } from './work-item/work-item-quick-add/work-item-quick-add.module';

// Mock data
import { MockDataService } from './shared/mock-data.service';
import { MockHttp } from './shared/mock-http';

import { ToastNotificationComponent } from './toast-notification/toast-notification.component';

// conditionally import the inmemory resource module
let serviceImports: Array<any[] | any | ModuleWithProviders>;
let providers: any[] = [
  GlobalSettings,
  serviceImports
];

// The inmemory environment variable is checked and if present then the in-memory dataset is added.
if (process.env.ENV == 'inmemory') {
  serviceImports = [
    Logger,
    AuthenticationService,
    Broadcaster,
    LoginService,
    UserService,
    MockDataService,
    authApiUrlProvider,
    {
      provide: Spaces,
      useExisting: SpacesService
    }

  ];
  providers = [
    GlobalSettings,
    witApiUrlProvider,
    serviceImports,
    SpacesService,
    ssoApiUrlProvider,
    MockHttp,
    DummySpace,
    {
      provide: HttpServiceLGC,
      useExisting: MockHttp
    }
  ];
} else {
  serviceImports = [
    Logger,
    AuthenticationService,
    Broadcaster,
    LoginService,
    UserService,
    MockDataService,
    authApiUrlProvider,
    {
      provide: Spaces,
      useExisting: SpacesService
    },
    SpacesService,
    ssoApiUrlProvider,
  ];
  providers = [
    GlobalSettings,
    witApiUrlProvider,
    serviceImports,
    DummySpace,
    {
      provide: Http,
      useClass: HttpServiceLGC
    }
  ];
}

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    DropdownModule,
    FormsModule,
    HttpModule,
    ModalModule,
    TabsModule,
    TooltipModule,
    PlannerListModule
  ],
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    ToastNotificationComponent,
  ],
  providers: providers,
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(private globalSettings: GlobalSettings) {}
}
