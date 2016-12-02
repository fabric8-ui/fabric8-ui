import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NoContentComponent } from './no-content.component';

console.log('`No-content` bundle loaded');

const routes: Routes = [
  {
    path: '',
    redirectTo: 'no-content',
    pathMatch: 'full'
  },
  {
    path: 'no-content',
    component: NoContentComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class NoContentRoutingModule {}
