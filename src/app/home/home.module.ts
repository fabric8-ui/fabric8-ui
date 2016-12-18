import { SpaceDialogModule } from '../space-dialog/space-dialog.module';
import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { HomeComponent }   from './home.component';
import { HomeRoutingModule }   from './home-routing.module';

@NgModule({
  imports:      [ CommonModule, HomeRoutingModule, HttpModule, SpaceDialogModule ],
  declarations: [ HomeComponent ]
})
export class HomeModule {
  constructor(http: Http) {}
}