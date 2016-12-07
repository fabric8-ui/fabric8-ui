import './rxjs-extensions';

// Globals
import Globals = require('./shared/globals');

import { ModuleWithProviders, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
import { DropdownModule } from 'ng2-dropdown';
import { TabsModule } from 'ng2-bootstrap/components/tabs';
import { ModalModule } from 'ng2-modal';
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';

// Imports for loading & configuring the in-memory web api
// if not used will be removed for production by treeshaking
import { InMemoryDataService } from './in-memory-data.service';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api/in-memory-web-api.module';

// Shared
import { AuthenticationService } from './auth/authentication.service';
import { Broadcaster } from './shared/broadcaster.service';
import { UserService } from './user/user.service';
import { Logger } from './shared/logger.service';

import { FormsModule } from '@angular/forms';

// App components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Board
import { BoardModule } from './board/board.module';

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
import { WorkItemListModule } from './work-item/work-item-list/work-item-list.module';

// Mock data
import { MockDataService } from './shared/mock-data.service';

// Main areas
import { ChatModule } from './chat/chat.module';
import { CodeModule } from './code/code.module';
import { HomeModule } from './home/home.module';
import { HypothesisModule } from './hypothesis/hypothesis.module';
import { NotificationsModule } from './notifications/notifications.module';
import { PipelineModule } from './pipeline/pipeline.module';
import { SettingsModule } from './settings/settings.module';
import { TestModule } from './test/test.module';
import { ObsidianModule } from './obsidian/obsidian.module';

//SubMenu
import { DashboardModule } from './dashboard/dashboard.module';
import { LearnModule } from './learn/learn.module';

// conditionally import the inmemory resource module
var serviceImports: Array<any[] | any | ModuleWithProviders>;

// The inmemory environment variable is checked and if present then the in-memory dataset is added.
if (process.env.ENV == 'inmemory') {
  Globals.inTestMode = true;
  serviceImports = [
    Logger,
    AuthenticationService,
    Broadcaster,
    LoginService,
    UserService,
    WorkItemService,
    MockDataService
  ];
} else {
  serviceImports = [
    Logger,
    AuthenticationService,
    Broadcaster,
    LoginService,
    UserService,
    WorkItemService
  ];
}

@NgModule({
  imports: [
    BrowserModule,
    BoardModule,
    ChatModule,
    CodeModule,
    DashboardModule,
    DropdownModule,
    FormsModule,
    HomeModule,
    HypothesisModule,
    HttpModule,
    LearnModule,
    ModalModule,
    NotificationsModule,
    PipelineModule,
    SettingsModule,
    TabsModule,
    TestModule,
    TooltipModule,
    WorkItemListModule,
    AppRoutingModule
  ],
  declarations: [    
    AppComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    WorkItemSearchComponent
  ],
  providers: serviceImports,
  bootstrap: [ AppComponent ]
})
export class AppModule { }
