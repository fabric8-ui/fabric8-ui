import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule, ApplicationRef } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';


// App is our top level component
import { AppRoutingModule } from './app.routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home';

// ng2 dependencies
import { DropdownModule } from 'ngx-dropdown';
import { TabsModule } from 'ng2-bootstrap/components/tabs';
import { ModalModule } from 'ngx-modal';
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';

// shared components
import { GlobalSettings } from './shared/globals';
import { Settings } from 'fabric8-shared-services';
import { Broadcaster, Logger } from 'ngx-base';
import {
  AuthenticationService,
  UserService
} from 'ngx-login-client';

// fabric8 components - services
import { LoginService } from 'fabric8-planner';
import { WorkItemService } from 'fabric8-planner';
import { MockDataService } from 'fabric8-planner';

// fabric8 components - components
import { WorkItemModule } from 'fabric8-planner';


/**
 * `AppModule` is the main entry point into Angular2's bootstraping process
 */
@NgModule({
  bootstrap: [ AppComponent ],
  declarations: [
    AppComponent,
    HomeComponent
  ],
  imports: [ // import Angular's modules
    AppRoutingModule,
    BrowserModule,
    FormsModule,
    HttpModule,
    DropdownModule,
    HttpModule,
    ModalModule,
    TabsModule,
    TooltipModule,
    WorkItemModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    Logger,
    AuthenticationService,
    LoginService,
    UserService,
    WorkItemService,
    MockDataService,
    Settings,
    Broadcaster
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public mockDataService: MockDataService,
    public settingsService: Settings,
    private globalSettings: GlobalSettings
  ) {
    console.log(mockDataService);
    console.log(settingsService);
    this.globalSettings.setTestMode(process.env.ENV == 'inmemory' ? true : false);
  }

}
