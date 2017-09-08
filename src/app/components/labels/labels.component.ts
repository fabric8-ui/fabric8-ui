import {
  Component,
  EventEmitter,
  OnInit,
  Input,
  Output
} from '@angular/core';
import { User } from 'ngx-login-client';

@Component({
  selector: 'f8-label',
  templateUrl: './labels.component.html',
  styleUrls: ['./labels.component.less']
})

export class LabelsComponent implements OnInit {

  @Input() labels: any[];
  @Input() truncateAfter: number;
  @Output() onLabelClick = new EventEmitter();
  @Output() onRemoveLabel = new EventEmitter();

  ngOnInit() {
    this.labels = [{
      name: 'frontend',
      color: '#f7bd7f'
    },
    {
      name: 'backend',
      color: '#c8eb79'
    },
    {
      name: 'bug',
      color: '#9ecf99'
    },
    {
      name: 'iteration',
      color: '#ededed'
    },
    {
      name: 'board view',
      color: '#7bdbc3'
    },
    {
      name: 'list view',
      color: '#7cdbf3'
    },
    {
      name: 'user story',
      color: '#a18fff'
    }];
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
