import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';

import { LoginComponent }  from './login/login.component';
import { CardService } from './card.service';
import { CardListComponent } from './card-list.component';
import { BoardComponent } from './board.component';
import { CardDetailComponent } from './card-detail.component';

import '../../public/css/styles.css';

@Component({
  selector: 'my-app',
<<<<<<< HEAD:app/app.component.ts
  template: `
  <div *ngIf="loggedIn" class="error">
    <h1>{{title}}</h1>
    <nav>
      <a [routerLink]="['/card-list']" routerLinkActive="active">Work Item List</a>
      <a [routerLink]="['/board']" routerLinkActive="active">Board</a>
    </nav>
  </div>
    <router-outlet></router-outlet>
  `,
  styleUrls: ['app/app.component.css'],
=======
  templateUrl: './app.component.html',
  styleUrls: ['/app.component.css'],
>>>>>>> upstream/master:src/app/app.component.ts
  directives: [
    ROUTER_DIRECTIVES
  ],
  providers: [
    CardService
  ],
  precompile: [
    LoginComponent,
    CardListComponent,
    BoardComponent,
    CardDetailComponent
  ]
})
export class AppComponent {
  title = 'Red Hat ALMighty';
  loggedIn = false;
}
