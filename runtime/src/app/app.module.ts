import './rxjs-extensions';

import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule, Http, RequestOptions, XHRBackend } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// FIXME: do we really need to have this modules on top-level?
import { DropdownModule } from 'ng2-bootstrap';
import { TabsModule, TooltipModule } from 'ng2-bootstrap';
import { TruncateModule } from 'ng2-truncate';

import { Broadcaster, Logger, Notifications } from 'ngx-base';
import { Spaces } from 'ngx-fabric8-wit';
import { ModalModule } from 'ngx-modal';
import { AuthenticationService, UserService, HttpService as HttpServiceLGC } from 'ngx-login-client';

// Mock data
import { MockDataService } from 'fabric8-planner';
import { MockHttp } from 'fabric8-planner';

// Shared
import { GlobalSettings } from './shared/globals';
import { SpacesService } from './services/spaces.service';
import { authApiUrlProvider } from './shared/auth-api.provider';
import { ssoApiUrlProvider } from './shared/sso-api.provider';
import { witApiUrlProvider } from './shared/wit-api.provider';

// Header
import { HeaderComponent } from './components/header/header.component';

// Login
import { LoginComponent } from './components/login/login.component';
import { LoginService } from './services/login.service';

// App components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

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
    Notifications,
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
    {
      provide: HttpServiceLGC,
      useExisting: MockHttp
    },
    {
      provide: Http,
      useExisting: HttpServiceLGC
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
    Notifications,
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
    TruncateModule
  ],
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent
  ],
  providers: providers,
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(private globalSettings: GlobalSettings) {}
}
