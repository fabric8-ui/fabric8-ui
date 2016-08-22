import { Routes, RouterModule } from '@angular/router';

import {LoginComponent} from "./login.component";
import {BoardComponent} from "./board.component";
import {WorkItemListComponent} from './work-item-list.component';
import {WorkItemDetailComponent} from "./work-item-detail.component";

const appRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'work-item-list',
    component: WorkItemListComponent
  },
  {
    path: 'board',
    component: BoardComponent
  },
  {
    path: '',
    redirectTo: '/work-item-list',
    pathMatch: 'full'
  },
  {
    path: 'detail/:id',
    component: WorkItemDetailComponent
  },

];

export const routing = RouterModule.forRoot(appRoutes);
