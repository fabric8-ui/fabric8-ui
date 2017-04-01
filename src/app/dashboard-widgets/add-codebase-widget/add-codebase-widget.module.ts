import { AddCodebaseWidgetRoutingModule } from './add-codebase-widget-routing.module';
import { CodebasesCreateModule } from './../../create/codebases/codebases-create/codebases-create.module';
import { AddCodebaseWidgetComponent } from './add-codebase-widget.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@NgModule({
  imports: [CommonModule, FormsModule, AddCodebaseWidgetRoutingModule, CodebasesCreateModule],
  declarations: [AddCodebaseWidgetComponent],
  exports: [AddCodebaseWidgetComponent]
})
export class AddCodebaseWidgetModule { }
