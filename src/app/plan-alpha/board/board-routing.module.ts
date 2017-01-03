import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BoardComponent } from './board.component';

const routes: Routes = [
  {
    path: '',
    component: BoardComponent,
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
export class BoardRoutingModule {}