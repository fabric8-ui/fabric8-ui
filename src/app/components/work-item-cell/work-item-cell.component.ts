import { Component, 
    Input, Output  } from '@angular/core';

@Component({
    selector: 'work-item-cell',
    template: './work-item-cell.component.html'
})

export class WorkItemCellComponent {
    constructor() {

    }
    @Input() col: string;
    a: string;

}
