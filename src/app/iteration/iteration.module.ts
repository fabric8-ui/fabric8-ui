import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { CollapseModule } from 'ng2-bootstrap';
import { DropdownModule } from 'ng2-dropdown';

import { IterationComponent } from './iteration.component';
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';

@NgModule({
  imports: [
    DropdownModule,
    CollapseModule,
    CommonModule,
    TooltipModule
  ],
  declarations: [IterationComponent],
  exports: [IterationComponent],
  providers: []
})
export class IterationModule { }
