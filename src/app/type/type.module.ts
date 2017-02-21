import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ng2-bootstrap';
import { DropdownModule } from 'ng2-dropdown';

import { TypeComponent } from './type.component';
import { ModalModule } from 'ng2-modal';
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';

@NgModule({
  imports: [
    CollapseModule,
    CommonModule,
    DropdownModule,
    FormsModule,
    ModalModule,
    TooltipModule
  ],
  declarations: [
    TypeComponent
  ],
  exports: [TypeComponent]
})
export class TypeModule { }
