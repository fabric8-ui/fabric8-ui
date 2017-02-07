import { NgModule }         from '@angular/core';
import { CommonModule }     from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { StackDetailsComponent }     from './stack-details.component';

@NgModule({
  imports:      [ CommonModule, HttpModule ],
  declarations: [ StackDetailsComponent ],
  exports: [ StackDetailsComponent ]
})
export class StackDetailsModule {
  constructor(http: Http) {}
}
