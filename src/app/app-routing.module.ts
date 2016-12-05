import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { DataResolver } from './app.resolver';

/*
export function loadChildrenDetail() {
  return System.import('./+detail').then((comp: any) => {
    return comp.default;
  });
}
export function loadChildrenAbout() {
  return System.import('./about').then((comp: any) => {
    return comp.default;
  });
}
export function loadChildrenNoConent() {
  return System.import('./no-content').then((comp: any) => {
    return comp.default;
  });
}
*/

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'about',
    // loadChildren: loadChildrenDetail
    // loadChildren: '../../aot/app/about/about.module.ngfactory#AboutModuleNgFactory'
    loadChildren: './about/about.module#AboutModule'
  },
  {
    path: 'detail',
    // loadChildren: loadChildrenAbout
    // loadChildren: '../../aot/app/+detail/detail.module.ngfactory#DetailModuleNgFactory'
    loadChildren: './+detail/detail.module#DetailModule'
  },
  {
    path: '**',
    // loadChildren: loadChildrenNoConent
    // loadChildren: '../../aot/app/no-content/no-content.module.ngfactory#NoContentModuleNgFactory'
    loadChildren: './no-content/no-content.module#NoContentModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {}
