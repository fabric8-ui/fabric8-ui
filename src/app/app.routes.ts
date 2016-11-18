import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home';
import { AboutComponent } from './about';
import { NoContentComponent } from './no-content';

import { DataResolver } from './app.resolver';

export function loadChildrenDetail() {
  return System.import('./+detail').then((comp: any) => {
    return comp.default;
  })
}

export const ROUTES: Routes = [
  { path: '',      component: HomeComponent },
  { path: 'home',  component: HomeComponent },
  { path: 'about', component: AboutComponent },
  {
    path: 'detail', loadChildren: loadChildrenDetail
  },
  { path: '**',    component: NoContentComponent },
];
