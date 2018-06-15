import { RouterModule } from '@angular/router';

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import {
  WidgetsModule
} from 'ngx-widgets';

import { TruncateModule } from 'ng2-truncate';
import { CollapseModule } from 'ngx-bootstrap';
import { ModalModule } from 'ngx-modal';
import { GroupTypesModule } from '../../components_ngrx/group-types-panel/group-types-panel.module';
import { IterationModule } from '../../components_ngrx/iterations-panel/iterations-panel.module';
import { TypeaheadDropdownComponent } from './typeahead-dropdown.component';

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
    TypeaheadDropdownComponent
  ],
  exports: [TypeaheadDropdownComponent]
})
export class TypeaheadDropDownModule { }
