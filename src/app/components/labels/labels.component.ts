import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { User } from 'ngx-login-client';

@Component({
  selector: 'f8-label',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.less']
})

export class LabelsComponent implements OnInit, OnChanges {

  @Input() labels: any[];
  @Input() truncateAfter: number;
  @Output() onLabelClick = new EventEmitter();
  @Output() onRemoveLabel = new EventEmitter();

  showMore: boolean = false;

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    this.labels = changes.labels.currentValue;
  }

  moreClick(event) {
    event.stopPropagation();
  }

  clickLabel(label, event) {
    event.stopPropagation();
    this.onLabelClick.emit(label);
    console.log(label, 'Label Click');
  }

  removeLabel(label, event) {
    event.stopPropagation();
    this.onRemoveLabel.emit(label);
    console.log(label, 'Remove Label');
  }
}
