import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';

// Imports for loading & configuring the in-memory web api
import { HttpModule, XHRBackend } from '@angular/http';
import { InMemoryBackendService, SEED_DATA } from 'angular2-in-memory-web-api';
import { InMemoryDataService }               from './in-memory-data.service';

import { AppComponent }  from './app.component';
import { routing } from './app.routing';


import { LoginComponent} from './login.component';
import { HeaderComponent} from './header.component';
import { FooterComponent} from './footer.component';
import { BoardComponent} from './board.component';
import { CardDetailComponent } from './card-detail.component';
import { CardListComponent } from './card-list.component';
import { CardSearchComponent } from './card-search.component';
import { CardService } from './card.service';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        routing
    ],
    declarations: [
        LoginComponent,
        HeaderComponent,
        FooterComponent,
        AppComponent,
        BoardComponent,
        CardDetailComponent,
        CardListComponent,
        CardSearchComponent
    ],
    providers: [
        CardService,
        { provide: XHRBackend, useClass: InMemoryBackendService }, // in-mem server
        { provide: SEED_DATA,  useClass: InMemoryDataService }     // in-mem server data
    ],
    bootstrap: [ AppComponent ]
})
export class AppModule {

}
