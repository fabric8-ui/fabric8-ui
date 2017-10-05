import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlannerLayoutComponent } from './planner-layout.component';

@NgModule({
  imports: [ CommonModule ],
  declarations: [ PlannerLayoutComponent ],
  exports: [ PlannerLayoutComponent ]
})
export class PlannerLayoutModule { }
