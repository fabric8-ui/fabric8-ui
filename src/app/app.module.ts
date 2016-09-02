import './rxjs-extensions';
import '../../public/scss/styles.scss';

import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule }    from '@angular/http';


// Imports for loading & configuring the in-memory web api
// Uncomment the below to support running the in-memory dataset.
// import { InMemoryWebApiModule } from 'angular2-in-memory-web-api';
// import { InMemoryDataService } from './in-memory-data.service';

import { AppComponent }  from './app.component';
import { routing } from './app.routing';
import { Logger } from './shared/logger.service';

import { LoginService } from './login/login.service';
import { BoardComponent} from './board/board.component';
import { FooterComponent} from './footer/footer.component';
import { HeaderComponent} from './header/header.component';
import { LoginComponent} from './login/login.component';
import { WorkItemDetailComponent } from './work-item/work-item-detail/work-item-detail.component';
import { WorkItemListComponent } from './work-item/work-item-list/work-item-list.component';
import { WorkItemQuickAddComponent } from './work-item/work-item-quick-add/work-item-quick-add.component';
import { WorkItemSearchComponent } from './work-item/work-item-search/work-item-search.component';
import { WorkItemService } from './work-item/work-item.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    // InMemoryWebApiModule.forRoot(InMemoryDataService),
    routing
  ],
  declarations: [
    AppComponent,
    BoardComponent,
    FooterComponent,
    HeaderComponent,
    LoginComponent,
    WorkItemDetailComponent,
    WorkItemQuickAddComponent,
    WorkItemListComponent,
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
