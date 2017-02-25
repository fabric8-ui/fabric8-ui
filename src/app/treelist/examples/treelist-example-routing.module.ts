import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TreeListExampleComponent } from './treelist-example.component';

const routes: Routes = [
  {
    path: '',
    component: TreeListExampleComponent
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class TreeListExampleRoutingModule {}
