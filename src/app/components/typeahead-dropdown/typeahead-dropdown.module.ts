import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  WidgetsModule,
} from 'ngx-widgets';

import { CollapseModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-modal';
import { GroupTypesModule } from '../group-types-panel/group-types-panel.module';
import { IterationModule } from '../iterations-panel/iterations-panel.module';
import { TypeaheadDropdown } from './typeahead-dropdown.component';
import { TruncateModule } from 'ng2-truncate';

@NgModule({
  imports: [
    CollapseModule,
    CommonModule,
    GroupTypesModule,
    IterationModule,
    ModalModule,
    RouterModule,
    TruncateModule,
    WidgetsModule
  ],
  declarations: [
    TypeaheadDropdown
  ],
  exports: [TypeaheadDropdown]
})
export class TypeaheadDropDownModule { }
