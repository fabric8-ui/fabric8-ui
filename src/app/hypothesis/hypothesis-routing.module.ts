import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HypothesisComponent } from './hypothesis.component';

const routes: Routes = [
  {
    path: 'hypothesis',
    component: HypothesisComponent,
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
export class HypothesisRoutingModule {}