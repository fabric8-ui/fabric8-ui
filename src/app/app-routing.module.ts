import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FilterExampleComponent } from './filters/examples/filter-example.component';
import { HomeComponent } from './home/home.component';
import { ListViewExampleComponent } from './listview/examples/listview-example.component';
import { SortExampleComponent } from './sort/examples/sort-example.component';
import { ToastNotificationExampleComponent } from './notification/examples/toast-notification-example.component';
import { ToastNotificationListExampleComponent } from './notification/examples/toast-notification-list-example.component';
import { ToolbarExampleComponent } from './toolbar/examples/toolbar-example.component';
import { TreeListExampleComponent } from './treelist/examples/treelist-example.component';
import { SlideOutExampleComponent } from './slide-out-panel/examples/slide-out-example.component';

const routes: Routes = [{
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },{
    path: 'home',
    component: HomeComponent
  },{
    path: 'filter',
    component: FilterExampleComponent
  },{
    path: 'listview',
    component: ListViewExampleComponent
  },{
    path: 'sort',
    component: SortExampleComponent
  },{
    path: 'slideoutpanel',
    component: SlideOutExampleComponent
  },{
    path: 'toolbar',
    component: ToolbarExampleComponent
  },{
    path: 'treelist',
    component: TreeListExampleComponent
  },{
    path: 'toastnotification',
    component: ToastNotificationExampleComponent
  },{
    path: 'toastnotificationlist',
    component: ToastNotificationListExampleComponent
}];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
