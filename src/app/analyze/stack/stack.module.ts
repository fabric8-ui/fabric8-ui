import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { StackComponent }     from './stack.component';
import { StackRoutingModule } from './stack-routing.module';

@NgModule({
  imports:      [ CommonModule, StackRoutingModule, HttpModule ],
  declarations: [ StackComponent ],
})
export class StackModule {
  constructor(http: Http) {}
}
