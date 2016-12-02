import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { HomeComponent }   from './home.component';
import { HomeRoutingModule }   from './home-routing.module';
// import { Title } from './title/title.service';
// import { XLarge } from './x-large/x-large.directive';

@NgModule({
  imports:      [ CommonModule, HomeRoutingModule ],
  declarations: [ HomeComponent]
})
export class HomeModule { }
