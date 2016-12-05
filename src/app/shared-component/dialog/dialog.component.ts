import {
  animate,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  state,
  style,
  transition,
  trigger
  
} from '@angular/core';

import { Dialog } from './dialog';

@Component({
  selector: 'pf-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
   animations: [
    trigger('modalState', [
      state('inactive', style({
        opacity: '0',
        transform: 'translateY(-50%)'
      })),
      state('active', style({
        opacity: '1',
        transform: 'translateY(0)'
      })),
      transition('inactive <=>active', animate('500ms ease all'))
    ]),
    trigger('modalOverlay', [
      state('inactive', style({
        background: 'transparent'
      })),
      state('active', style({
        background: 'rgba(0,0,0,0.4)'
      })),
      transition('inactive <=>active', animate('500ms ease all'))
    ]),
  ]
})

export class DialogComponent implements OnInit {

  @Input() dialog: Dialog;

  @Output('pfDialogClick') onClick = new EventEmitter();

  modalFadeIn: Boolean = false;
  modalState: string = 'inactive';

  constructor() {
  }

  ngOnInit(): void {
    //need to fade in the modal
    this.modalFadeIn = true;
    setTimeout(() => this.modalState = 'active');
  }

  closeModal() {
    this.btnClick(0);
  }

  btnClick(val: number): void {
    this.modalState = 'inactive';
    // 300ms this much time the animation takes to close the modal
    setTimeout(() => {
      this.onClick.emit(val);
      this.modalFadeIn = false;
    }, 300);
  }
}
