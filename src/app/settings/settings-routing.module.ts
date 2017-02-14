import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';
import { ProfileComponent } from './profile/profile.component';
import { SettingsAuthGuard } from './settings-auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'pmuir/settings',
    pathMatch: 'full'
  },
  {
    path: '',
    component: SettingsComponent,
    canActivate: [SettingsAuthGuard],
    canActivateChild: [SettingsAuthGuard],
    children: [
      { path: '', component: ProfileComponent },
      { path: 'emails', loadChildren: './emails/emails.module#EmailsModule' },
      {
        path: 'notifications',
        loadChildren: './notifications/notifications.module#NotificationsModule'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }
