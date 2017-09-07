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
  @Output() onLabelClick = new EventEmitter();
  @Output() onDeleteLabel = new EventEmitter();

  ngOnInit() {

  }

  moreClick(event) {
    event.stopPropagation();
  }
}
