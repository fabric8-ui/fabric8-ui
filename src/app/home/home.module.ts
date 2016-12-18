import { ModalModule } from 'ng2-modal';
import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { HomeComponent }   from './home.component';
import { HomeRoutingModule }   from './home-routing.module';
import { SpaceDialogComponent }   from '../space-dialog/space-dialog.component';

@NgModule({
  imports:      [ CommonModule, HomeRoutingModule, HttpModule, ModalModule ],
  declarations: [ HomeComponent, SpaceDialogComponent ]
})
export class HomeModule {
  constructor(http: Http) {}
}