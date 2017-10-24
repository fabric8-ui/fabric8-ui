import { Component, ViewChild } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Modal } from 'ngx-modal';

import { ModalService } from '../../services/modal.service';

@Component({
  selector: 'osio-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.less']
})
export class ModalComponent {

  @ViewChild('OSIOModal') private modal: Modal;
  private title: string;
  private buttonText: string;
  private message: string;
  private actionKey: string;

  constructor(private modalService: ModalService) {
    this.modalService.getComponentObservable().subscribe((params: string[]) => {
      this.actionKey = params[3];
      this.open(params[0], params[1], params[2]);
    })
  }

  public open(title: string, message: string, buttonText: string) {
    this.title = title;
    this.message = message;
    this.buttonText = buttonText;
    this.modal.open();
  }

  public doAction() {
    this.modal.close();
    this.modalService.doAction(this.actionKey);
  }
}
