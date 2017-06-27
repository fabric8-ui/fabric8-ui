import { Space, Spaces } from 'ngx-fabric8-wit';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  OnChanges,
  Output,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { cloneDeep } from 'lodash';
import { Broadcaster, Logger, Notification, NotificationType, Notifications } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';

import { FilterService } from '../../services/filter.service';

import { WorkItemType } from '../../models/work-item-type';
import { WorkItem, WorkItemRelations } from '../../models/work-item';
import { WorkItemService } from '../../services/work-item.service';

@Component({
  selector: 'alm-work-item-quick-add',
  templateUrl: './work-item-quick-add.component.html',
  styleUrls: ['./work-item-quick-add.component.scss']
})
export class WorkItemQuickAddComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @ViewChild('quickAddTitle') qaTitle: any;
  @ViewChild('quickAddDesc') qaDesc: any;
  @ViewChildren('quickAddTitle', {read: ElementRef}) qaTitleRef: QueryList<ElementRef>;
  @ViewChild('quickAddSubmit') qaSubmit: any;

  @Input() wilistview: string = 'wi-list-view';
  @Input() forcedType: WorkItemType = null;
  @Output('workItemCreate') workItemCreate = new EventEmitter();

  error: any = false;
  workItem: WorkItem;
  validTitle: Boolean;
  showQuickAdd: Boolean;
  showQuickAddBtn: Boolean;
  initialDescHeight: number = 0;
  initialDescHeightDiff: number = 0;
  descHeight: any = '27px';
  descResize: any = 'none';
  spaceSubscription: Subscription = null;
  selectedType: WorkItemType  = null;
  availableTypes: WorkItemType[] = null;
  eventListeners: any[] = [];

  constructor(
    private workItemService: WorkItemService,
    private broadcaster: Broadcaster,
    private logger: Logger,
    private notifications: Notifications,
    private auth: AuthenticationService,
    private filterService:FilterService,
    private spaces: Spaces) {}

  ngOnInit(): void {
    this.createWorkItemObj();
    this.showQuickAdd = false;
    this.showQuickAddBtn = this.auth.isLoggedIn();
    this.listenToEvents();
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      if (space) {
        this.showQuickAddBtn = true;
        // get the available types for this space
        this.workItemService.getWorkItemTypes().first().subscribe((workItemTypes: WorkItemType[]) => {
          this.availableTypes = workItemTypes;
          if (this.forcedType) {
            this.selectedType = this.forcedType;
          } else {
            // the first entry is the default entry for now
            this.selectedType = this.availableTypes[0];
          }
        });
      } else {
        this.showQuickAddBtn = false;
      }
    });

  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.spaceSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.forcedType) {
      this.logger.log('Updated forcedType on quick add component to ' + changes.forcedType.currentValue.attributes.name);
      this.selectedType = changes.forcedType.currentValue;
    }
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
    //set the default work item type
    this.workItem.relationships.baseType = {
      data: {
        id: this.selectedType?this.selectedType.id:'testtypeid',
        type: this.selectedType?this.selectedType.type:'testtype'
      }
    }
    //Go through the active filters and apply them
    let currentFilters = this.filterService.getAppliedFilters();
    if( currentFilters.length ) {
      for (let f=0; f < currentFilters.length; f++) {
        switch (currentFilters[f].id) {
          case 'iteration':
            this.workItem.relationships.iteration = {
              data: {
                id: currentFilters[f].value,
                type: currentFilters[f].id
              }
            } as any;
            break;
          case 'area':
            this.workItem.relationships.area = {
              data: {
                id: currentFilters[f].value,
                type: currentFilters[f].id
              }
            } as any;
            break;
          case 'workitemtype':
            this.workItem.relationships.baseType = {
              data: {
                id: currentFilters[f].value,
                type: currentFilters[f].id+'s'
              }
            } as any;
            //update the selected filter
            if(this.availableTypes != null) {
              this.selectedType = this.availableTypes.find(item => item.id===currentFilters[f].value);
            }
            break;
          case 'assignee':
            this.workItem.relationships.assignees = {
              data: [{
                id: currentFilters[f].value,
                type: 'identities'
              }]
            } as any;
          break;
        }
      }
    }
  }

  ngAfterViewInit() {
    this.qaTitleRef.changes.subscribe(item => {
      if (item.length) {
        this.qaTitle.nativeElement.focus();
      }
    });
  }

  selectType(event: any, type: WorkItemType) {
    if (event)
      event.preventDefault();
    this.logger.log('Selected type ' + type.attributes.name + ' for quick add.');
    this.selectedType = type;
  }

  save(event: any = null): void {
    if (event)
      event.preventDefault();

    // Setting type in relationship
    // this.workItem.relationships = {
    //   baseType: {
    //     data: {
    //       id: this.selectedType?this.selectedType.id:'testtypeid',
    //       type: this.selectedType?this.selectedType.type:'testtype'
    //     }
    //   }
    // } as WorkItemRelations;

    //Set the current selected iteration


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

    if (this.workItem.attributes['system.title']) {
      this.qaSubmit.nativeElement.setAttribute('disabled', true);
      this.qaTitle.nativeElement.setAttribute('disabled', true);
      this.workItemService
        .create(this.workItem)
        .map((workItem: WorkItem) => {
          workItem.relationships.baseType.data = this.selectedType;
          return workItem;
        })
        .subscribe(workItem => {
          this.workItem = workItem; // saved workItem, w/ id if new
          this.workItemService.emitAddWI(this.workItem);
          this.resetQuickAdd();
          this.qaSubmit.nativeElement.removeAttribute('disabled');
          this.qaTitle.nativeElement.removeAttribute('disabled');
        },
        error => {
          this.error = error;
          this.qaSubmit.nativeElement.removeAttribute('disabled');
          this.qaTitle.nativeElement.removeAttribute('disabled');
      }); // TODO: Display error message

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
    this.createWorkItemObj();
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
    } else {
      this.createWorkItemObj();
    }
  }

  preventDef(event: any) {
    event.preventDefault();
  }

  listenToEvents() {
    this.eventListeners.push(
      this.filterService.filterObservable.subscribe(item => {
        this.createWorkItemObj();
      })
    );
  }

}
