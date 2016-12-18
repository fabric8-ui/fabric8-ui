import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { SettingsComponent }     from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';

import { SettingsOverviewModule } from './settings-overview/settings-overview.module'

@NgModule({
  imports:      [ CommonModule, SettingsRoutingModule, HttpModule, SettingsOverviewModule ],
  declarations: [ SettingsComponent ],
})
export class SettingsModule {
  constructor(http: Http) {}
}