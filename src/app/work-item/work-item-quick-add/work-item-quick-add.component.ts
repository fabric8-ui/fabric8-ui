import { 
  AfterViewInit,
  Component, 
  EventEmitter,
  ElementRef,
  Input, 
  OnInit, 
  Output, 
  ViewChild, 
  ViewChildren,   
  Renderer,
  QueryList
} from '@angular/core';

import { Logger } from '../../shared/logger.service';

import { WorkItem, WorkItemAttributes, WorkItemRelations } from '../../models/work-item';
import { WorkItemService } from '../work-item.service';


@Component({
  selector: 'alm-work-item-quick-add',
  templateUrl: './work-item-quick-add.component.html',
  styleUrls: ['./work-item-quick-add.component.scss']
})
export class WorkItemQuickAddComponent implements OnInit, AfterViewInit {
  @ViewChild('quickAddTitle') qaTitle: any;
  @ViewChild('quickAddDesc') qaDesc: any;
  @ViewChildren('quickAddTitle', {read: ElementRef}) qaTitleRef: QueryList<ElementRef>;

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
    private logger: Logger,
    private renderer: Renderer) {}

  ngOnInit(): void {
    this.createWorkItemObj();
    this.showQuickAdd = false;
    this.showQuickAddBtn = true;
  }

  createWorkItemObj() {
    this.workItem = new WorkItem();
    this.workItem.attributes = new WorkItemAttributes();
    this.workItem.relationships = new WorkItemRelations();
    this.workItem.type = 'workitems';
    this.workItem.id = '42';
    this.workItem.relationships = {
      baseType: {
        data: {
          id: 'system.userstory',
          type: 'workitemtypes'
        }
      }
    } as WorkItemRelations;

    this.workItem.attributes = {
      'system.state': 'new'
    } as WorkItemAttributes;
  }

  ngAfterViewInit() {
    this.qaTitleRef.changes.subscribe(item => {
      if (item.length) {
        this.renderer.invokeElementMethod(this.qaTitle.nativeElement, 'focus');
      }
    });
  } 

  save(event: any = null): void {
    if (event) event.preventDefault();
    if (this.workItem.attributes['system.title'] != null) {
      this.workItem.attributes['system.title'] = this.workItem.attributes['system.title'].trim();
    }
    if (this.workItem.attributes['system.description'] != null) {
      this.workItem.attributes['system.description'] = this.workItem.attributes['system.description'].trim();
    }
    if (this.workItem.attributes['system.title']) {
      this.workItemService
        .create(this.workItem)
        .then(workItem => {
          this.workItem = workItem; // saved workItem, w/ id if new
          this.logger.log(`created and returned this workitem:` + JSON.stringify(workItem));
          this.resetQuickAdd();
        })
        .catch(error => this.error = error); // TODO: Display error message
    } else {
      this.error = 'Title can not be empty.';
    }
  }

  checkTitle(): void {
    if (this.workItem.attributes['system.title'] && this.workItem.attributes['system.title'].trim()) {
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

  resetQuickAdd(): void {
    this.validTitle = false;
    this.ngOnInit();
    this.showQuickAddBtn = false;
    this.showQuickAdd = true;
    this.descHeight = this.initialDescHeight ? this.initialDescHeight : '26px';
    this.qaTitle.nativeElement.focus();
  }

  toggleQuickAdd(): void {
    this.showQuickAdd = !this.showQuickAdd;
    this.showQuickAddBtn = !this.showQuickAddBtn;
    if (!this.showQuickAdd) {
      this.workItem.attributes['system.description'] = '';
      this.workItem.attributes['system.title'] = '';
      this.validTitle = false;
      this.descHeight = this.initialDescHeight ? this.initialDescHeight : 'inherit';
    }
  }

  preventDef(event: any) {
    event.preventDefault();
  }
}