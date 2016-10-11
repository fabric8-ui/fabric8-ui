import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output
} from '@angular/core';

import { Dialog } from './dialog';

@Component({
  selector: 'pf-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})

export class DialogComponent implements OnInit {

  @Input() dialog: Dialog;

  @Output('pfDialogClick') onClick = new EventEmitter();

  modalFadeIn: Boolean = false;


  constructor() {
  }

  ngOnInit(): void {
    //need to fade in the modal
    this.modalFadeIn = true;
  }

  closeModal() {
    this.btnClick(0);
  }

  btnClick(val: number): void {
    this.onClick.emit(val);
    this.modalFadeIn = false;
  }
}
