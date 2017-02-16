import {
  animate,
  Component,
  EventEmitter,
  HostListener,
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
  selector: 'alm-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  // template: `
  //   <div class="modal" id="alm-modal" tabindex="-1" role="dialog"
  //     [ngClass]="{'show': modalFadeIn,'hide':!modalFadeIn}" [@modalOverlay]="modalState"
  //     aria-labelledby="almModal" aria-hidden="false">
  //     <div class="modal-dialog" [@modalState]="modalState">
  //       <div class="modal-content">
  //         <div class="modal-header">
  //           <button type="button" class="close"
  //             (click)="closeModal()" data-dismiss="modal" aria-hidden="true">
  //             <span class="pficon pficon-close"></span>
  //           </button>
  //           <h4 *ngIf='dialog.title'>{{ dialog.title ? dialog.title : '' }}</h4>
  //         </div>
  //         <div class="modal-body">
  //           <div class="product-versions-pf">
  //             <span *ngIf='dialog.message' id="alm-dialog-message">
  //               {{ dialog.message ? dialog.message : '' }}
  //             </span>
  //           </div>
  //         </div>
  //         <div *ngIf='dialog.actionButtons' class="modal-footer">
  //           <button *ngFor="let btn of dialog.actionButtons"
  //             type="submit" class="btn marginR10 pull-left"
  //             [class.btn-primary]="btn.default"
  //             value="{{ btn.value}}"
  //             (click)="btnClick(btn.value)">
  //                 {{ btn.title }}
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // `,
  // styles: [`
  // @import "../../../assets/stylesheets/color-variables";
  // @import "../../../assets/stylesheets/mixins";
  // .modal-footer{
  //     .btn{
  //         &:hover{
  //             background-color: $color-pf-light-blue-500;
  //             @include gradient-vertical($color-pf-blue-300, $color-pf-blue-400);
  //             border-color: $color-pf-blue-500;
  //             color: $color-pf-white;
  //         }
  //     }
  //   }
  // `],
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

  @HostListener('window:keydown', ['$event'])
  onActionKeyPress(event: any): void {
    let currentDefaultIndex = this.dialog.actionButtons.findIndex(i => i.default);
    this.dialog.actionButtons[currentDefaultIndex].default = false;
    let len = this.dialog.actionButtons.length;
    if (event.keyCode == 37) { // Left arrow
      let newDefaultIndex = ((currentDefaultIndex - 1) + len) % len;
      this.dialog.actionButtons[newDefaultIndex].default = true;
    } else if (event.keyCode == 39) { // Right arrow
      let newDefaultIndex = ((currentDefaultIndex - 1) + len) % len;
      this.dialog.actionButtons[newDefaultIndex].default = true;
    } else if (event.keyCode == 13) { // Enter
      this.btnClick(this.dialog.actionButtons[currentDefaultIndex].value);
    } else if (event.keyCode == 27) { // Esc key
      this.btnClick(0);
    }
  }
}
