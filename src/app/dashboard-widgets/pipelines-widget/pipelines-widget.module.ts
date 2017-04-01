import { PipelinesWidgetComponent } from './pipelines-widget.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [PipelinesWidgetComponent],
  exports: [PipelinesWidgetComponent]
})
export class PipelinesWidgetModule { }
