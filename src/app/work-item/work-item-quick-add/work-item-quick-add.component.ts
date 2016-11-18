import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { Logger } from '../../shared/logger.service';

import { WorkItem } from '../work-item';
import { WorkItemService } from '../work-item.service';


@Component({
  selector: 'alm-work-item-quick-add',
  templateUrl: './work-item-quick-add.component.html',
  styleUrls: ['./work-item-quick-add.component.scss']
})
export class WorkItemQuickAddComponent implements OnInit {
  @Output() close = new EventEmitter();
  @ViewChild('quickAddTitle') qaTitle: any;
  @ViewChild('quickAddDesc') qaDesc: any;

  error: any = false;
  workItem: WorkItem;
  validTitle: Boolean;
  showQuickAdd: Boolean;
  showQuickAddBtn: Boolean;
  initialDescHeight: number = 0;
  initialDescHeightDiff: number = 0;
  descHeight: any = '26px';
  descResize: any = 'none';
  
  constructor(
    private workItemService: WorkItemService,
    private logger: Logger) {
  }

  ngOnInit(): void {
    this.workItem = {
      'fields': {
        'system.assignee': null,
        'system.state': 'new',
        'system.creator': 'me',
        'system.title': null,
        'system.description': null
      },
      'type': 'system.userstory',
      'version': 0
    } as WorkItem;
    this.showQuickAdd = false;
    this.showQuickAddBtn = true;
  }

  save(event: any = null): void {
    if (event) event.preventDefault();
    if (this.workItem.fields['system.title'] != null) {
      this.workItem.fields['system.title'] = this.workItem.fields['system.title'].trim();
    }
    if (this.workItem.fields['system.description'] != null) {
      this.workItem.fields['system.description'] = this.workItem.fields['system.description'].trim();
    }
    if (this.workItem.fields['system.title']) {
      this.workItemService
        .create(this.workItem)
        .then(workItem => {
          this.workItem = workItem; // saved workItem, w/ id if new
          this.logger.log(`created and returned this workitem:` + JSON.stringify(workItem));
          this.workItem.fields['system.description'] = '';
          this.workItem.fields['system.title'] = '';
          this.validTitle = false;
          this.goBack(workItem);
          this.showQuickAddBtn = false;
          this.showQuickAdd = true;
          this.descHeight = this.initialDescHeight ? this.initialDescHeight : '26px';
          this.qaTitle.nativeElement.focus();
        })
        .catch(error => this.error = error); // TODO: Display error message
    } else {
      this.error = 'Title can not be empty.';
    }
  }

  checkTitle(): void {
    if (this.workItem.fields['system.title'] && this.workItem.fields['system.title'].trim()) {
      this.validTitle = true;
    } else {
      this.validTitle = false;
    }
  }

  checkDesc(): void {
    if (!this.initialDescHeight) {
      this.initialDescHeight = this.qaDesc.nativeElement.offsetHeight;
      this.initialDescHeightDiff = this.initialDescHeight - this.qaDesc.nativeElement.scrollHeight; 
    }
    this.descHeight = this.qaDesc.nativeElement.scrollHeight + this.initialDescHeightDiff; 
  }

  goBack(savedWorkItem: WorkItem = null): void {
    this.close.emit(savedWorkItem);
    this.ngOnInit();
  }

  toggleQuickAdd(): void {
    this.showQuickAdd = !this.showQuickAdd;
    this.showQuickAddBtn = !this.showQuickAddBtn;
    if (!this.showQuickAdd) {
      this.workItem.fields['system.description'] = '';
      this.workItem.fields['system.title'] = '';
      this.validTitle = false;
      this.descHeight = this.initialDescHeight ? this.initialDescHeight : 'inherit';
    }
  }

  preventDef(event: any) {
    event.preventDefault();
  }
}