import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { SettingsComponent }     from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
  imports:      [ CommonModule, SettingsRoutingModule, HttpModule ],
  declarations: [ SettingsComponent ],
})
export class SettingsModule {
  constructor(http: Http) {}
}