import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BsDropdownConfig, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { AssigneesComponent } from './assignee.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TooltipModule,
    BsDropdownModule
  ],
  declarations: [
    AssigneesComponent
  ],
  providers: [ TooltipConfig, BsDropdownConfig ],
  exports: [AssigneesComponent]
})
export class AssigneesModule { }
