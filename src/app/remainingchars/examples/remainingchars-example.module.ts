import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { RemainingCharsModule } from '../remainingchars.module';
import { RemainingCharsExampleComponent } from './remainingchars-example.component';
import { RemainingCharsExampleRoutingModule } from './remainingchars-example-routing.module';

@NgModule({
  declarations: [ RemainingCharsExampleComponent ],
  imports: [
    CommonModule,
    HttpModule,
    RemainingCharsExampleRoutingModule,
    RemainingCharsModule
  ]
})
export class RemainingCharsExampleModule {
  constructor(http: Http) {}
}
