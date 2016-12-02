import { NgModule }             from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { DataResolver } from './app.resolver';

// export function loadChildrenDetail() {
//   return System.import('./+detail').then((comp: any) => {
//     return comp.default;
//   });
// }

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'about',
    loadChildren: 'app/about/about.module#AboutModule'
  },
  {
    path: 'detail',
    loadChildren: 'app/+detail/detail.module#DetailModule'
  },
  {
    path: '**',
    loadChildren: 'app/no-content/no-content.module#NoContentModule'
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
