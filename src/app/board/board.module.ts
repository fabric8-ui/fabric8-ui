import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';

import { BoardComponent }   from './board.component';
import { BoardRoutingModule }   from './board-routing.module';

@NgModule({
  imports:      [ CommonModule, BoardRoutingModule ],
  declarations: [ BoardComponent ],
  exports: [ BoardComponent ]
})
export class BoardModule { }