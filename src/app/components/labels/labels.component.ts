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

  showMore: boolean = false;

  ngOnInit() {
    console.log(this.truncateAfter, "##### label component #####");
    this.labels = [{
      name: 'frontend',
      'background-color': '#f7bd7f',
      'text-color': '#303030'
    },
    {
      name: 'backend',
      'background-color': '#c8eb79',
      'text-color': '#303030'
    },
    {
      name: 'bug',
      'background-color': '#9ecf99',
      'text-color': '#303030'
    },
    {
      name: 'iteration',
      'background-color': '#ededed',
      'text-color': '#303030'
    },
    {
      name: 'board view',
      'background-color': '#7bdbc3',
      'text-color': '#303030'
    },
    {
      name: 'list view',
      'background-color': '#7cdbf3',
      'text-color': '#303030'
    },
    {
      name: 'user story',
      'background-color': '#a18fff',
      'text-color': '#303030'
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
