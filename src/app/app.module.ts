import './rxjs-extensions';

import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
import { FormsModule } from '@angular/forms';

import { DropdownModule } from 'ngx-dropdown';
import { TabsModule } from 'ng2-bootstrap/components/tabs';
import { ModalModule } from 'ngx-modal';
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';
import {
  AuthenticationService,
  Broadcaster,
  Logger,
  UserService
} from 'ngx-login-client';

// Shared
import { authApiUrlProvider } from './shared/standalone/auth-api.provider';
import { SpaceService } from './shared/mock-spaces.service';
import { GlobalSettings } from './shared/globals';

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

// Work
import { WorkItemSearchComponent } from './work-item/work-item-search/work-item-search.component';
import { WorkItemService } from './work-item/work-item.service';
import { WorkItemModule } from './work-item/work-item.module';

// Mock data
import { MockDataService } from './shared/mock-data.service';

import { ToastNotificationComponent } from './toast-notification/toast-notification.component';

// conditionally import the inmemory resource module
let serviceImports: Array<any[] | any | ModuleWithProviders>;

// The inmemory environment variable is checked and if present then the in-memory dataset is added.
if (process.env.ENV == 'inmemory') {
  serviceImports = [
    Logger,
    AuthenticationService,
    Broadcaster,
    LoginService,
    UserService,
    WorkItemService,
    MockDataService,
    SpaceService,
    authApiUrlProvider
  ];
} else {
  serviceImports = [
    Logger,
    AuthenticationService,
    Broadcaster,
    LoginService,
    UserService,
    WorkItemService,
    MockDataService,
    SpaceService,
    authApiUrlProvider
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
    WorkItemModule
  ],
  declarations: [
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    ToastNotificationComponent,
    WorkItemSearchComponent
  ],
  providers: [ GlobalSettings, serviceImports ],
  bootstrap: [ AppComponent ]
})
export class AppModule {
  constructor(private globalSettings: GlobalSettings) {
    this.globalSettings.setTestMode(process.env.ENV == 'inmemory' ? true : false);
  }
}
