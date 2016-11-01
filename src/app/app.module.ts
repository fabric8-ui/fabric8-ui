import './rxjs-extensions';

import { ModuleWithProviders, NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule }    from '@angular/http';
import { DropdownModule } from 'ng2-dropdown';

// Imports for loading & configuring the in-memory web api
// if not used will be removed for production by treeshaking
import { InMemoryDataService } from './in-memory-data.service';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api/in-memory-web-api.module';

// Shared
import { AuthenticationService } from './auth/authentication.service';
import { Broadcaster } from './shared/broadcaster.service';
import { UserService } from './user/user.service';
import { Logger } from './shared/logger.service';

import { FormsModule }   from '@angular/forms';

// App components
import { AppComponent }  from './app.component';
import { AppRoutingModule } from './app-routing.module';

// Board
import { BoardComponent } from './board/board.component';

// Footer
import { FooterComponent } from './footer/footer.component';

// Header
import { HeaderComponent } from './header/header.component';

// Login
import { LoginComponent } from './login/login.component';
import { LoginService } from './login/login.service';

// Work-Item
import { WorkItemSearchComponent }    from './work-item/work-item-search/work-item-search.component';
import { WorkItemService }            from './work-item/work-item.service';
import { WorkItemModule }             from './work-item/work-item.module';

// conditionally import the inmemory resource module
var moduleImports: Array<any[] | any | ModuleWithProviders>;

// The inmemory environment variable is checked and if present then the in-memory dataset is added.
if (process.env.ENV == 'inmemory') {
  moduleImports = [
    BrowserModule,
    DropdownModule,
    FormsModule,
    WorkItemModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    AppRoutingModule
  ];
} else {
  moduleImports = [
    BrowserModule,
    DropdownModule,
    FormsModule,
    WorkItemModule,
    HttpModule,
    AppRoutingModule
  ];
}

@NgModule({
  imports: moduleImports,
  // imports: [
  //   AppRoutingModule,
  //   BrowserModule,
  //   FormsModule,
  //   HttpModule,
  //   // InMemoryWebApiModule.forRoot(InMemoryDataService)
  //   // The inmemory environment variable is checked and if present then the in-memory dataset is added.
  //   // process.env.ENV == 'inmemory' ? InMemoryWebApiModule.forRoot(InMemoryDataService) : null
  // ],
  declarations: [    
    AppComponent,
    BoardComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    WorkItemSearchComponent
  ],
  providers: [
    Logger,
    AuthenticationService,
    Broadcaster,
    LoginService,
    UserService,
    WorkItemService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
