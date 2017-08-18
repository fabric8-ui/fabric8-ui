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
export class SwitchComponent implements OnInit {
  @Input () isChecked: string;
  @Output() onChecked = new EventEmitter();

  checked: Boolean;

  ngOnInit(): void {
    console.log(this.isChecked, '#$#$#$#$#$');
    if(this.isChecked === 'true') {
      this.checked = true;
    } else {
      this.checked = false;
    }
  }

  toggleSwitch(event) {
    // console.log(event, '####### toogleSwitch');
    console.log(this.isChecked, '#$#$#$#$#$');
    this.onChecked.emit(event);
  }
}
