import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CodeComponent } from './code.component';

const routes: Routes = [
  {
    path: 'code',
    component: CodeComponent,
    children: [
      {
        path: ''
      }
    ]
  },

];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class CodeRoutingModule {}