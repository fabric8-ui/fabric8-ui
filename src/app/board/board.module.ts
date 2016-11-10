import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { BoardComponent }   from './board.component';

@NgModule({
  imports:      [ CommonModule ],
  declarations: [ BoardComponent ],
  exports: [ BoardComponent ]
})
export class BoardModule { }