import { cloneDeep } from 'lodash';
import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';
import { LabelModel, LabelUI } from './../../models/label.model';

@Component({
  selector: 'f8-label',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.less']
})

export class LabelsComponent {
  private _labels: LabelUI[] = [];

  @Input('labels') set labelInput(labels: LabelUI[]) {
    this._labels = labels.filter(label => {
      return label.backgroundColor &&
      label.textColor
    })
  };

  @Input() truncateAfter: number;
  @Input() allowDelete: boolean;
  @Output() onLabelClick = new EventEmitter();
  @Output() onRemoveLabel = new EventEmitter();

  private labels: LabelUI[] = [];
  private showMore: boolean = false;

  constructor() {}

  moreClick(event) {
    event.stopPropagation();
  }

  clickLabel(label, event) {
    event.stopPropagation();
    this.onLabelClick.emit(label);
  }

  removeLabel(label, event) {
    event.stopPropagation();
    this.onRemoveLabel.emit(label);
  }
}
