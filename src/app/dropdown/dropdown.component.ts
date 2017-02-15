import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { DropdownOption } from './dropdown-option';

@Component({
  selector: 'alm-dropdown',
  templateUrl: './dropdown.component.html',
  // template: `
  //   <div *ngIf="selected" class="dropdown card-pf-time-frame-filter">
  //     <button
  //       (click)="toggle()"
  //       type="button"
  //       class="btn dropdown-toggle alm-dropdown-btn {{selected.active_class ? selected.active_class : 'btn-default'}}"
  //       data-toggle="dropdown">
  //       {{selected.option}} <span *ngIf="!disabled" class="caret"></span>
  //     </button>
  //     <ul *ngIf="show && !disabled" class="dropdown-menu dropdown-menu-left" style="display:block" role="menu">
  //       <li *ngFor="let option of options;"
  //         class="{{option.option_class}}"
  //         (click)="onChange(option)">
  //         <a>{{option.option}}</a>
  //       </li>
  //     </ul>
  //   </div>
  // `,
  styleUrls: ['./dropdown.component.scss'],
//   styles: [`
//     @import "../../../assets/stylesheets/custom";
//     /*
//     .status{
//       width: 130px;
//       text-align: left;
//     }
//
//     .status span.label{
//       border-radius: 10px;
//       padding: 5px 20px;
//       opacity: 0.7;
//       cursor: pointer;
//     }
//
//     .alm-dropdown {
//       position: absolute;
//       z-index: 100;
//       margin-top: $margin10;
//       height: auto;
//       background-color: rgb(243, 231, 231);
//       @include borderRadius(7px);
//       padding-left: $pad10;
//       padding-right: $pad10;
//       li{
//         list-style: none;
//         font-size: $font12;
//         text-align: $textLeft;
//         cursor: pointer;
//         &:hover{
//           font-weight: 600;
//         }
//       }
//     }*/
//
//       .alm-dropdown-btn{
//         min-width: em(100);
//       }
//   `]
// })
export class DropdownComponent implements OnInit {
  @Input() options: DropdownOption[];
  @Input() selected: DropdownOption;
  @Input() disabled: Boolean;

  @Output('change') onUpdate = new EventEmitter();

  show: boolean = false;

  constructor() {
  }

  ngOnInit(): void {
  }

  toggle(): void {
    this.show = !this.show;
  }

  open(): void {
    this.show = true;
  }

  close(): void {
    this.show = false;
  }

  onChange(option: DropdownOption): void {
    this.onUpdate.emit({
      currentOption: this.selected,
      newOption: option
    });
    this.toggle();
  }
}
