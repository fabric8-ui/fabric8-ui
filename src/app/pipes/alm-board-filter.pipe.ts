import { WorkItem } from './../models/work-item';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'almFilterBoardList'})
export class AlmFilterBoardList implements PipeTransform {
  transform(arr: WorkItem[], matchState: string) {    
    return arr.filter((item: WorkItem) => item.attributes['system.state'] === matchState);   
  }
}