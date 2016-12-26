import { NgModule }           from '@angular/core';
import { CommonModule }       from '@angular/common';
import { CountPipe } from 'ng2bln-count-pipe';

import { AlmIconModule } from './../../shared-component/icon/almicon.module';
import { WorkItemBoardComponent }   from './work-item-board.component';
import { BoardRoutingModule }   from './work-item-board-routing.module';
//pipes

import { AlmFilterBoardList } from './../../pipes/alm-board-filter.pipe';



@NgModule({
  imports:      [ AlmIconModule, BoardRoutingModule, CommonModule],
  declarations: [ AlmFilterBoardList, CountPipe , WorkItemBoardComponent, ],
  exports: [ WorkItemBoardComponent ]
})
export class WorkItemBoardModule { }
