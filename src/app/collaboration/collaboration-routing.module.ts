import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CollaborationComponent } from './collaboration.component';

const routes: Routes = [
  {
    path: '',
    component: CollaborationComponent,
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
export class CollaborationRoutingModule {}