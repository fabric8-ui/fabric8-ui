import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import { IterationListEntryComponent } from '../iteration-list-entry/iteration-list-entry.component'
import { IterationModel } from '../../models/iteration.model';

@Component({
    selector: 'iteration-tree',
    templateUrl: './iteration-tree.component.html',
    styleUrls: ['./iterations-tree.component.less']
})
export class IterationTreeComponent implements OnChanges, OnInit {

  //using any as we are adding showChildren parameter
  @Input() iterationList: any[] = [];
  @Input() collection: any;
  @Input() witGroup: string = '';

  @Output() onEditIteration = new EventEmitter<IterationModel>();
  @Output() onCloseIteration = new EventEmitter<IterationModel>();
  @Output() onCreateIteration = new EventEmitter<IterationModel>();


  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    const list = changes.iterationList;
    if ( list.previousValue !== undefined ) {
      //restore the showChildren value so that the tree state is retained
      list.currentValue.map(item => {
        item.showChildren = false;
        let ind = list.previousValue.findIndex( i => i.id === item.id);
        if( ind >=0 )
          item.showChildren = list.previousValue[ind].showChildren;
      });
      this.iterationList = list.currentValue;
    } else {
      this.iterationList.map( item => item.showChildren = false );
    }
  }

  toggleChildrenDisplay(iteration) {
    iteration.showChildren = !iteration.showChildren;
  }

  editIteration(iteration) {
    this.onEditIteration.emit(iteration);
  }

  closeIteration(iteration) {
    this.onCloseIteration.emit(iteration);
  }

  createIteration(iteration) {
    this.onCreateIteration.emit(iteration);
  }
}
