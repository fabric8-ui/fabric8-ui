import { PlannerModule, PlannerListModule } from 'fabric8-planner';
import { WidgetsModule } from 'ngx-widgets';
import { CreateWorkItemWidgetComponent } from './create-work-item-widget.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [CommonModule, FormsModule, WidgetsModule, PlannerListModule ],
  declarations: [CreateWorkItemWidgetComponent],
  exports: [CreateWorkItemWidgetComponent],
})
export class CreateWorkItemWidgetModule { }
