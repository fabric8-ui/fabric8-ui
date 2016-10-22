import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { DragulaModule } from 'ng2-dragula/ng2-dragula';

import { BoardComponent }   from './board.component';
import { BoardRoutingModule }   from './board-routing.module';

@NgModule({
  imports:      [ CommonModule, BoardRoutingModule, DragulaModule ],
  declarations: [ BoardComponent ],
  exports: [ BoardComponent ]
})
export class BoardModule { }