import {
  Component,
  Input,
  Output
} from '@angular/core';

@Component({
    selector: 'work-item-cell',
    template: `
      <span>{{col}}</span>
    `
})

export class WorkItemCellComponent {
    constructor() {

    }
    @Input() col: string;
    a: string;

}
