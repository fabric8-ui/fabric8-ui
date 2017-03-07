import { WorkItemQuickAddModule } from './work-item/work-item-quick-add/work-item-quick-add.module';
import { DummySpace } from './header/DummySpace.service';
import './rxjs-extensions';

import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http }    from '@angular/http';
import { FormsModule } from '@angular/forms';

import { DropdownModule } from 'ng2-bootstrap';
import { ModalModule } from 'ngx-modal';
import { TabsModule, TooltipModule } from 'ng2-bootstrap';
import {
  AuthenticationService,
  Broadcaster,
  Logger,
  UserService,
  HttpService
} from 'ngx-login-client';

// Shared
import { authApiUrlProvider } from './shared/standalone/auth-api.provider';
import { GlobalSettings } from './shared/globals';
import { witApiUrlProvider } from './shared/wit-api.provider';

// App components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Footer
import { FooterComponent } from './footer/footer.component';

// Header
import { HeaderComponent } from './header/header.component';

// Login
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';

// import { WorkItemModule } from './work-item/work-item.module';
import { PlannerBoardModule } from './work-item/work-item-board/planner-board.module';
import { PlannerListModule } from './work-item/work-item-list/planner-list.module';

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
    authApiUrlProvider
  ];
  providers = [
    GlobalSettings,
    witApiUrlProvider,
    serviceImports,
    DummySpace,
    {
      provide: Http,
      useClass: MockHttp
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
    authApiUrlProvider
  ];
  providers = [
    GlobalSettings,
    witApiUrlProvider,
    serviceImports,
    DummySpace,
    {
      provide: Http,
      useClass: HttpService
    }
  ];
}

@NgModule({
  imports: [
    AppRoutingModule,
    BrowserModule,
    DropdownModule,
    FormsModule,
    HttpModule,
    ModalModule,
    TabsModule,
    TooltipModule,
    PlannerListModule,
    PlannerBoardModule
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
