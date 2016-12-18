import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WorkComponent } from './work.component';

const routes: Routes = [
  {
    path: '',
    component: WorkComponent,
    children: [
      {
        path: ''
      }
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class WorkRoutingModule {}