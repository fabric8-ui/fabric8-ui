import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FilterExampleComponent } from './filters/examples/filter-example.component';
import { HomeComponent } from './home/home.component';
import { SortExampleComponent } from './sort/examples/sort-example.component';
import { ToolbarExampleComponent } from './toolbar/examples/toolbar-example.component';
import { TreeListExampleComponent } from './treelist/examples/treelist-example.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'filter',
    component: FilterExampleComponent
  },
  {
    path: 'sort',
    component: SortExampleComponent
  },
  {
    path: 'toolbar',
    component: ToolbarExampleComponent
  },
  {
    path: 'treelist',
    component: TreeListExampleComponent
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
