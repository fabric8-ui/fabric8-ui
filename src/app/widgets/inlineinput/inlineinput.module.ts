import { CommonModule } from '@angular/common';
import { NgModule }  from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AlmEditableModule } from 'ngx-widgets';
import { AutosizeDirective } from './../autosize/autosize.directive';
import { InlineInputComponent } from './inlineinput.component';

@NgModule({
  declarations: [ InlineInputComponent, AutosizeDirective ],
  imports: [ CommonModule, FormsModule, AlmEditableModule ],
  exports: [ InlineInputComponent ]
})
export class InlineInputModule { }
