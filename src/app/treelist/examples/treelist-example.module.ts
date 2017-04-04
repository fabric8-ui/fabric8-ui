import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpModule, Http } from '@angular/http';

import { DropdownModule } from 'ng2-bootstrap';
import { TreeListModule } from '../treelist.module';
import { TreeModule } from 'angular-tree-component';

import { TreeListExampleComponent } from './treelist-example.component';
import { TreeListExampleRoutingModule } from './treelist-example-routing.module';

@NgModule({
  declarations: [ TreeListExampleComponent ],
  imports: [
    CommonModule,
    DropdownModule,
    HttpModule,
    TreeListExampleRoutingModule,
    TreeListModule,
    TreeModule
  ]
})
export class TreeListExampleModule {
  constructor(http: Http) {}
}
