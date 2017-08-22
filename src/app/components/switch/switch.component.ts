import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { User } from 'ngx-login-client';

@Component({
  selector: 'switch',
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.less']
})
export class SwitchComponent {
  @Input () isChecked: Boolean;
  @Output() onChecked = new EventEmitter();

  toggleSwitch(event) {
    // console.log(event, '####### toogleSwitch');
    this.onChecked.emit(event);
  }
}
