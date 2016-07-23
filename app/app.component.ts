import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { CardService } from './card.service';
import { CardsComponent } from './cards.component';
import { BoardComponent } from './board.component';
import { CardDetailComponent } from './card-detail.component';

@Component({
  selector: 'my-app',
  template: `
    <h1>{{title}}</h1>
    <nav>
      <a [routerLink]="['/board']" routerLinkActive="active">Board</a>
      <a [routerLink]="['/cards']" routerLinkActive="active">Cards</a>
    </nav>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app/app.component.css'],
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [
    CardService
  ],
  precompile: [
    CardsComponent,
    BoardComponent,
    CardDetailComponent
  ]
})
export class AppComponent {
  title = 'Red Hat ALM';
}
