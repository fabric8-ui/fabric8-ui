import {
  AfterViewInit,
  AfterViewChecked,
  Component,
  EventEmitter,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { cloneDeep } from 'lodash';
import { Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { WorkItemTypeUI } from '../../models/work-item-type';
import { WorkItem, WorkItemRelations } from '../../models/work-item';
import { IterationUI } from './../../models/iteration.model';

@Component({
  selector: 'alm-work-item-quick-add',
  templateUrl: './work-item-quick-add.component.html',
  styleUrls: ['./work-item-quick-add.component.less']
})
export class WorkItemQuickAddComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {
  @ViewChild('quickAddTitle') qaTitle: any;
  @ViewChild('quickAddDesc') qaDesc: any;
  @ViewChildren('quickAddTitle', {read: ElementRef}) qaTitleRef: QueryList<ElementRef>;
  @ViewChild('quickAddSubmit') qaSubmit: any;
  @ViewChild('quickAddElement') quickAddElement: ElementRef;
  @ViewChild('inlinequickAddElement') inlinequickAddElement: ElementRef;

  @Input() parentWorkItemId: string = null;
  @Input() workItemTypes: WorkItemTypeUI[] = [];
  @Input() selectedType: WorkItemTypeUI = null;
  @Input() selectedIteration: IterationUI = null;
  @Input() wilistview: string = 'wi-list-view';


  error: any = false;
  workItem: WorkItem;
  validTitle: boolean;
  linkObject: object;

  // Board view specific
  initialDescHeight: number = 0;
  initialDescHeightDiff: number = 0;
  descHeight: any = '27px';
  descResize: any = 'none';
  showQuickAdd: boolean;

  constructor(
    private logger: Logger,
    private auth: AuthenticationService,
    private route: ActivatedRoute,
    private renderer: Renderer2) {}

  ngOnInit(): void {
    this.createWorkItemObj();

    // This is board view specific
    this.showQuickAdd = false;
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
  }

  setTypeContext(type: any) {
    this.logger.log('Force set type context on quick add component to ' + type.attributes.name);
    this.selectedType = type;
  }


  createWorkItemObj() {
    this.workItem = new WorkItem();
    this.workItem.attributes = new Map<string, string | number>();
    this.workItem.relationships = new WorkItemRelations();
    this.workItem.type = 'workitems';
    this.workItem.attributes['system.state'] = 'new';
  }

  ngAfterViewInit() {
    this.qaTitleRef.changes.subscribe(item => {
      if (item.length) {
        this.qaTitle.nativeElement.focus();
      }
    });
  }

  ngAfterViewChecked() {
    if (this.quickAddElement) {
      let quickaddWdth: number =  0;
      if (document.getElementsByClassName('f8-wi-list__quick-add').length > 0) {
        quickaddWdth = (document.getElementsByClassName('f8-wi-list__quick-add')[0] as HTMLElement).offsetWidth;
      }
      let targetWidth: number = quickaddWdth + 20;
      if (this.quickAddElement.nativeElement.classList.contains('f8-quick-add-inline')) {
        this.renderer.setStyle(this.quickAddElement.nativeElement, 'max-width', targetWidth + "px");
      }
    }
  }

  selectType(event: any, type: WorkItemTypeUI) {
    if (event)
      event.preventDefault();
    this.logger.log('Selected type ' + type.name + ' for quick add.');
    this.selectedType = type;
    this.qaTitle.nativeElement.focus();
  }

  save(event: any = null, openStatus: boolean = false): void {
    if (event)
      event.preventDefault();
    // Do we have a real title?
    // If yes, trim; if not, reassign it as a (blank) string.
    this.workItem.attributes['system.title'] =
      (!!this.workItem.attributes['system.title']) ?
        this.workItem.attributes['system.title'].trim() : '';

    // Same treatment as title, but this is more important.
    // As we're validating title in the next step
    // But passing on description as is (causing data type issues)
    this.workItem.attributes['system.description'] =
      (!!this.workItem.attributes['system.description']) ?
        this.workItem.attributes['system.description'].trim() : '';

    // Set the default work item type
    this.workItem.relationships.baseType = {
      data: {
        id: this.selectedType ? this.selectedType.id : 'testtypeid',
        type: 'workitemtypes'
      }
    }

    // Set the default iteration for new work item
    if (this.selectedIteration) {
      this.workItem.relationships.iteration = {
        data: {
          id: this.selectedIteration.id,
          type: 'iterations'
        }
      }
    }

    console.log('####-1', this.workItem);


    // if (this.workItem.attributes['system.title']) {
    //   this.qaSubmit.nativeElement.setAttribute('disabled', true);
    //   this.qaTitle.nativeElement.setAttribute('disabled', true);
    //   this.workItem.hasChildren = false;
    //   this.workItem.relationships.baseType.data = this.selectedType;
    // } else {
    //   this.error = 'Title can not be empty.';
    // }
  }

  checkTitle(): void {
    if (this.workItem.attributes['system.title'] && this.workItem.attributes['system.title'].trim()) {
      this.validTitle = true;
    } else {
      this.validTitle = false;
    }
  }

  resetQuickAdd(): void {
    this.validTitle = false;
    this.createWorkItemObj();
    this.showQuickAdd = true;
    this.descHeight = this.initialDescHeight ? this.initialDescHeight : '26px';
    this.qaSubmit.nativeElement.removeAttribute('disabled');
    this.qaTitle.nativeElement.removeAttribute('disabled');
    this.qaTitle.nativeElement.focus();
  }


  preventDef(event: any) {
    event.preventDefault();
  }

  // This board view specific
  checkDesc(): void {
    if (!this.initialDescHeight) {
      this.initialDescHeight = this.qaDesc.nativeElement.offsetHeight;
      this.initialDescHeightDiff = this.initialDescHeight - this.qaDesc.nativeElement.scrollHeight;
    }
    this.descHeight = this.qaDesc.nativeElement.scrollHeight + this.initialDescHeightDiff;
  }
}
