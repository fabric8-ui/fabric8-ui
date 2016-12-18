import { NgModule }  from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { SettingsOverviewComponent } from './settings-overview/settings-overview.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/settings',
    pathMatch: 'full'
  },
  {
    path: '',
    component: SettingsComponent,
    children: [
      { path: '',      component: SettingsOverviewComponent },
      { path: 'alerts', loadChildren: './alerts/alerts.module#AlertsModule' },
      { path: 'security', loadChildren: './security/security.module#SecurityModule' },
      { path: 'work', loadChildren: './work/work.module#WorkModule' },
    ]
  }
];

@NgModule({
  imports: [ RouterModule.forChild(routes) ],
  exports: [ RouterModule ]
})
export class SettingsRoutingModule {}