import { provideRouter, RouterConfig }  from '@angular/router';
import {CardlistComponent} from './cardlist.component';
import {BoardComponent} from "./board.component";
import {CardDetailComponent} from "./card-detail.component";

const routes: RouterConfig = [
  {
    path: 'cards',
    component: CardlistComponent
  },
  {
    path: 'board',
    component: BoardComponent
  },
  {
    path: '',
    redirectTo: '/cards',
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
