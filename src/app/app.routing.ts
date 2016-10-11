import { ModuleWithProviders }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';

import { BoardComponent } from './board/board.component';

import { WorkItemDetailComponent } from './work-item/work-item-detail/work-item-detail.component';
import { WorkItemListComponent } from './work-item/work-item-list/work-item-list.component';
import { WorkItemQuickAddComponent } from './work-item/work-item-quick-add/work-item-quick-add.component';

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
    path: 'quick-add/:id',
    component: WorkItemQuickAddComponent
  },
  {
    path: 'detail/:id',
    component: WorkItemDetailComponent
  },

];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });
