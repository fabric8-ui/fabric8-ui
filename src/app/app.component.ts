import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { CardService } from './card.service';
import { CardListComponent } from './card-list.component';
import { BoardComponent } from './board.component';
import { CardDetailComponent } from './card-detail.component';

import '../../public/css/styles.css';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['/app.component.css'],
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [
    CardService
  ],
  precompile: [
    CardListComponent,
    BoardComponent,
    CardDetailComponent
  ]
})
export class AppComponent {
  title = 'Red Hat ALMighty';
}
