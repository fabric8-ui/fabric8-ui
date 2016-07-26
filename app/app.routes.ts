import { provideRouter, RouterConfig }  from '@angular/router';
import {CardListComponent} from './card-list.component';
import {BoardComponent} from "./board.component";
import {CardDetailComponent} from "./card-detail.component";

const routes: RouterConfig = [
  {
    path: 'card-list',
    component: CardListComponent
  },
  {
    path: 'board',
    component: BoardComponent
  },
  {
    path: '',
    redirectTo: '/card-list',
    pathMatch: 'full'
  },
  {
    path: 'detail/:id',
    component: CardDetailComponent
  },

];

export const appRouterProviders = [
  provideRouter(routes)
];
