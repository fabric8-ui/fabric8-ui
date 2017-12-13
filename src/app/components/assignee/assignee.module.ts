import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { TooltipConfig, TooltipModule } from 'ngx-bootstrap/tooltip';
import { AssigneesComponent } from './assignee.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    TooltipModule
  ],
  declarations: [
    AssigneesComponent
  ],
  providers: [ TooltipConfig ],
  exports: [AssigneesComponent]
})
export class AssigneesModule { }
