import { AstronautService } from './../shared/astronaut.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { CollapseModule } from 'ng2-bootstrap';
import { DropdownModule } from 'ngx-dropdown';
import { ModalModule } from 'ngx-modal';
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';

import { TypeComponent } from './type.component';

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
  exports: [TypeComponent],
  providers: [AstronautService]
})
export class TypeModule { }
