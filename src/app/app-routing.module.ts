import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { SlideOutExampleComponent } from './slide-out-panel/examples/slide-out-example.component';
import { TreeListExampleComponent } from './treelist/examples/treelist-example.component';
import { MarkdownExampleComponent } from './markdown/examples/markdown-example.component';

const routes: Routes = [{
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },{
    path: 'home',
    component: HomeComponent
  },{
    path: 'slideoutpanel',
    component: SlideOutExampleComponent
  },{
    path: 'treelist',
    component: TreeListExampleComponent
  },{
    path: 'markdown',
    component: MarkdownExampleComponent
  }];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
