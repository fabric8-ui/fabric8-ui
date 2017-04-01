import { StarterWidgetComponent } from './starter-widget.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [CommonModule, FormsModule],
  declarations: [StarterWidgetComponent],
  exports: [StarterWidgetComponent]
})
export class StarterWidgetModule { }
