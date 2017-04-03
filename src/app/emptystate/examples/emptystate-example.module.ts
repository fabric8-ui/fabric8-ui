import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { EmptyStateModule } from '../emptystate.module';
import { EmptyStateExampleComponent } from './emptystate-example.component';
import { EmptyStateExampleRoutingModule } from './emptystate-example-routing.module';

@NgModule({
  declarations: [ EmptyStateExampleComponent ],
  imports: [
    CommonModule,
    HttpModule,
    EmptyStateExampleRoutingModule,
    EmptyStateModule
  ]
})
export class EmptyStateExampleModule {
  constructor(http: Http) {}
}
