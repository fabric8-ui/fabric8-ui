import { NgModule }  from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlmEditableModule } from 'ngx-widgets';
import { Autosize } from './../autosize/autosize.directive';
import { InlineInputComponent } from './inlineinput.component';

@NgModule({
  declarations: [ InlineInputComponent, Autosize ],
  imports: [ CommonModule, FormsModule, AlmEditableModule ],
  exports: [ InlineInputComponent ]
})
export class InlineInputModule { }
