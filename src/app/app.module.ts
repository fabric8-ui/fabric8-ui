import './rxjs-extensions';

import { NgModule }      from '@angular/core';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';

// Imports for loading & configuring the in-memory web api
// if not used will be removed for production by treeshaking
import { InMemoryDataService } from './in-memory-data.service';
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';

//Pipes
import { AlmTrim } from './pipes/alm-trim';

// Shared
import { Logger } from './shared/logger.service';

// Shared components
import { DialogComponent } from './shared-component/dialog/dialog.component';
import { DropdownComponent } from './shared-component/dropdown/dropdown.component';

// App components
import { AppComponent }  from './app.component';
import { routing } from './app.routing';

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
import { WorkItemDetailComponent }    from './work-item/work-item-detail/work-item-detail.component';
import { WorkItemListEntryComponent } from './work-item/work-item-list-entry/work-item-list-entry.component';
import { WorkItemListComponent }      from './work-item/work-item-list/work-item-list.component';
import { WorkItemQuickAddComponent }  from './work-item/work-item-quick-add/work-item-quick-add.component';
import { WorkItemSearchComponent }    from './work-item/work-item-search/work-item-search.component';
import { WorkItemService }            from './work-item/work-item.service';

// conditionally import the inmemory resource module
var moduleImports = [
      BrowserModule,
      FormsModule,
      HttpModule,
      routing
    ];

if (process.env.ENV == 'inmemory') {
  moduleImports.push(InMemoryWebApiModule.forRoot(InMemoryDataService));
}

@NgModule({
  imports: moduleImports,
  declarations: [
    AlmTrim,    
    AppComponent,
    BoardComponent,
    DialogComponent,
    DropdownComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    WorkItemDetailComponent,
    WorkItemQuickAddComponent,
    WorkItemListComponent,
    WorkItemListEntryComponent,
    WorkItemSearchComponent
  ],
  providers: [
    Logger,
    LoginService,
    WorkItemService
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
