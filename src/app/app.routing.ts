import { Routes, RouterModule } from '@angular/router';

import {BoardComponent} from "./board.component";
import {CardListComponent} from './card-list.component';
import {CardDetailComponent} from "./card-detail.component";

const appRoutes: Routes = [
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

export const routing = RouterModule.forRoot(appRoutes);
