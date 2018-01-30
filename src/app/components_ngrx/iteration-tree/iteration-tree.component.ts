import {
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
  SimpleChange
} from '@angular/core';
import { IterationListEntryComponent } from '../iteration-list-entry/iteration-list-entry.component'
import { IterationUI } from '../../models/iteration.model';

@Component({
    selector: 'iteration-tree',
    templateUrl: './iteration-tree.component.html',
})

export class IterationTreeComponent {

  @Input() iterationList: IterationUI[] = [];
  @Input() collection: any;
  @Input() witGroup: string = '';

  @Output() onEditIteration = new EventEmitter<IterationUI>();
  @Output() onCloseIteration = new EventEmitter<IterationUI>();
  @Output() onCreateIteration = new EventEmitter<IterationUI>();

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
