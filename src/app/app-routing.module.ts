import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';

import { BoardComponent } from './board/board.component';

import { WorkItemDetailComponent } from './work-item/work-item-detail/work-item-detail.component';
import { WorkItemListComponent } from './work-item/work-item-list/work-item-list.component';
import { WorkItemQuickAddComponent } from './work-item/work-item-quick-add/work-item-quick-add.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/work-item-list',
    pathMatch: 'full'
  },
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
    path: 'quick-add/:id',
    component: WorkItemQuickAddComponent
  },
  {
    path: 'detail/:id',
    component: WorkItemDetailComponent
  },

];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}