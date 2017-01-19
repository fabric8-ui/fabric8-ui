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
import { DropdownModule } from 'ng2-dropdown';
import { TabsModule } from 'ng2-bootstrap/components/tabs';
import { ModalModule } from 'ng2-modal';
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';

// fabric8 components - services
import { AuthenticationService } from 'fabric8-planner';
import { UserService } from 'fabric8-planner';
import { Logger } from 'fabric8-planner';
import { LoginService } from 'fabric8-planner';
import { WorkItemService } from 'fabric8-planner';
import { MockDataService } from 'fabric8-planner';

// fabric8 components - components
import { ChatModule } from 'fabric8-planner';
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
    ChatModule,
    //WorkItemModule
  ],
  providers: [ // expose our Services and Providers into Angular's dependency injection
    Logger,
    AuthenticationService,
    LoginService,
    UserService,
    WorkItemService,
    MockDataService
  ]
})
export class AppModule {

  constructor(
    public appRef: ApplicationRef,
    public mockDataService: MockDataService
  ) {
    console.log(mockDataService);
  }

}
