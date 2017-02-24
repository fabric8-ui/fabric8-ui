import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SortExampleComponent } from './sort-example.component';

const routes: Routes = [
  {
    path: '',
    component: SortExampleComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SortExampleRoutingModule {}
