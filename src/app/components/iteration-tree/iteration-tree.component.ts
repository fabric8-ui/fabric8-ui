import {Component, Input, OnInit} from '@angular/core';
import { IterationListEntryComponent } from '../iteration-list-entry/iteration-list-entry.component'
@Component({
    selector: 'iteration-tree',
    templateUrl: './iteration-tree.component.html',
})
export class IterationTreeComponent implements OnInit {

    @Input() iterationList: any;
    @Input() collection: any;
    //showChildren: Boolean = false;

    ngOnInit() {
      this.iterationList.map( item => item.showChildren = false );
    }

    toggleChildrenDisplay(iteration) {
      iteration.showChildren = !iteration.showChildren;
    }
}
