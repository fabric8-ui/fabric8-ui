import { WorkItemUI } from './../../models/work-item';
import { Component, Input, EventEmitter, Output, OnInit } from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';

@Component({
  selector: 'work-item-preview-panel',
  templateUrl: './work-item-preview-panel.component.html',
  styleUrls: ['./work-item-preview-panel.component.less'],
  animations: [
    trigger('slideInOut', [
      state('in', style({
        transform: 'translateX(5px)',
        left: 'auto'
      })),
      state('out', style({
        transform: 'translateX(100%)',
        left: '100%'
      })),
      transition('in => out', animate('200ms ease-in-out')),
      transition('out => in', animate('200ms ease-in-out'))
    ]),
  ]
})

export class WorkItemPreviewPanelComponent implements OnInit {

  @Output('onOpen') onOpen: EventEmitter<any> = new EventEmitter();
  @Output('onClose') onClose: EventEmitter<any> = new EventEmitter();

  private panelState: 'in' | 'out' = 'out';
  private workItem: WorkItemUI = null;

  ngOnInit() {

  }

  open(workItem: WorkItemUI) {
    if (workItem) {
      this.workItem = workItem;
      if (this.panelState === 'out')  {
        this.panelState = 'in';
        this.onOpen.emit();
      }
    }
  }

  close() {
    this.panelState = 'out';
    this.workItem = null;
    this.onClose.emit();
  }

}
