import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewEncapsulation
} from '@angular/core';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'work-item-cell',
  templateUrl: './work-item-cell.component.html',
  styleUrls: ['./work-item-cell.component.less']
})

export class WorkItemCellComponent {
    constructor() {
    }
    @Input() col: string;
    @Input() row: object;
    @Output() readonly onDetailPreview = new EventEmitter();
    @Output() readonly onQuickPreview = new EventEmitter();
    @Output() readonly clickLabel = new EventEmitter();

    onDetail(Event: MouseEvent, id: string) {
      this.onDetailPreview.emit(id);
    }

    labelClick(event) {
      this.clickLabel.emit(event);
    }

    onPreview(Event: MouseEvent, id: string) {
      this.onQuickPreview.emit(id);
    }
}
