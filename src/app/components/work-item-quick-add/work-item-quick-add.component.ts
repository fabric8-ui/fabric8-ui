import { Space, Spaces } from 'ngx-fabric8-wit';
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
import { Subscription } from 'rxjs/Subscription';
import { cloneDeep } from 'lodash';
import { Broadcaster, Logger, Notification, NotificationType, Notifications } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';

import { FilterService } from '../../services/filter.service';

import { GroupTypesService } from '../../services/group-types.service';
import { WorkItemType } from '../../models/work-item-type';
import { WorkItem, WorkItemRelations } from '../../models/work-item';
import { WorkItemService } from '../../services/work-item.service';

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
  @Input() quickAddContext: any[] = [];

  @Input('WITypes') set WITypeSetter(val: WorkItemType[]) {
    if (JSON.stringify(val) !== JSON.stringify(this.allWorkItemTypes)) {
      this.allWorkItemTypes = val;
      this.availableTypes = cloneDeep(this.allWorkItemTypes);
      this.allowedWITs = this.allWorkItemTypes.filter(entry => {
        return this.quickAddContext.findIndex(i => i.id === entry.id) >= 0;
      });
      if(this.availableTypes.length){
        //this.selectedType = this.availableTypes[0];
        this.selectedType = this.allowedWITs[0];
        if (this.wilistview === 'wi-table-view-top') {
          this.createWorkItemObj();
        }
      }
    }
  };

  @Input() wilistview: string = 'wi-list-view';

  @Input() set forcedType(val: WorkItemType) {
    if (this.forcedType) {
      this.logger.log('Updated forcedType on quick add component to ' + this.forcedType.attributes.name);
      this.selectedType = this.forcedType;
    }
  };
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
  allWorkItemTypes: WorkItemType[] = null;
  linkObject: object;
  childLinkType: any = null;
  allowedWITs: WorkItemType[] = [];

  constructor(
    private workItemService: WorkItemService,
    private broadcaster: Broadcaster,
    private logger: Logger,
    private notifications: Notifications,
    private auth: AuthenticationService,
    private filterService:FilterService,
    private groupTypesService: GroupTypesService,
    private route: ActivatedRoute,
    private spaces: Spaces,
    private renderer: Renderer2) {}

  ngOnInit(): void {
    this.createWorkItemObj();
    this.showQuickAdd = false;
    this.showQuickAddBtn = this.auth.isLoggedIn();
    this.listenToEvents();
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
  selectType(event: any, type: WorkItemType) {
    if (event)
      event.preventDefault();
    this.logger.log('Selected type ' + type.attributes.name + ' for quick add.');
    this.selectedType = type;
    var wiTitle = this.workItem.attributes['system.title'];
    var wiDescription = this.workItem.attributes['system.description'];
    this.createWorkItemObj();
    if (wiTitle)
      this.workItem.attributes['system.title'] = wiTitle;
    if (wiDescription)
      this.workItem.attributes['system.description'] = wiDescription;
  }

  createLinkObject(parentWorkItemId: string, childWorkItemId: string, linkId: string) : void {
    this.linkObject = {
      'type': 'workitemlinks',
      'attributes': {
        'version': 0
      },
      'relationships': {
        'link_type': {
          'data': {
            'id': linkId,
            'type': 'workitemlinktypes'
          }
        },
        'source': {
          'data': {
            'id': parentWorkItemId,
            'type': 'workitems'
          }
        },
        'target': {
          'data': {
            'id': childWorkItemId,
            'type': 'workitems'
          }
        }
      }
    };
  }

  save(event: any = null, openStatus: boolean = false): void {
    if (event)
      event.preventDefault();

    this.workItemCreate.emit({parentId: this.parentWorkItemId});

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
      this.workItem.hasChildren = false;
      console.log('before create ', this.workItem)
      this.workItemService
        .create(this.workItem)
        .map((workItem: WorkItem) => {
          workItem.hasChildren = false;
          workItem.relationships.baseType.data = this.selectedType;
          return workItem;
        })
        .subscribe(workItem => {
          if(this.parentWorkItemId != null) {
            this.createLinkObject(this.parentWorkItemId, workItem.id, '25c326a7-6d03-4f5a-b23b-86a9ee4171e9');
            let tempLinkObject = {'data': this.linkObject};
            this.workItemService.createLink(tempLinkObject)
              .subscribe(([link, includes]) => {
                this.workItemService.emitAddWIChild({
                  pwid: this.parentWorkItemId,
                  wid: workItem.id, status: openStatus
                  });
              })
          } else {
            this.workItemService.emitAddWI({wi: workItem, status: openStatus});
          }
          this.workItem = workItem; // saved workItem, w/ id if new
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


  preventDef(event: any) {
    event.preventDefault();
  }

  setGuidedWorkItemType(wiTypeCollection) {
    //if (this.wilistview === 'wi-list-view' || this.wilistview === 'wi-card-view')
    if (wiTypeCollection.length > 0) {
      let currentGT = this.groupTypesService.getCurrentGroupType();
      this.allowedWITs = this.allWorkItemTypes.filter(entry => {
        return currentGT.findIndex(i => i.id === entry.id) >= 0;
      });
      this.availableTypes = cloneDeep(this.allWorkItemTypes);
      let setWITCollection = new Set(wiTypeCollection);
      let setAvailableTypes = new Set(this.availableTypes);
      let intersection = new Set([...Array.from(setAvailableTypes)].filter(x => setWITCollection.has(x.id)));
      this.availableTypes = [...Array.from(intersection)];
      //this.selectedType = this.availableTypes[0];
      this.selectedType = this.allowedWITs[0];
      this.showQuickAdd = false
      this.showQuickAddBtn = true;
    } else {
      this.showQuickAddBtn = false;
      this.showQuickAdd = false;
    }
  }

  listenToEvents() {
    this.eventListeners.push(
      this.filterService.filterObservable.subscribe(item => {
        this.createWorkItemObj();
      })
    );

    this.eventListeners.push(
      this.groupTypesService.workItemSelected.subscribe(wiTypeCollection => {
        this.setGuidedWorkItemType(wiTypeCollection);
      })
    );

    this.eventListeners.push(
      this.groupTypesService.groupTypeSelected.subscribe(wiTypeCollection => {
        this.setGuidedWorkItemType(wiTypeCollection);
      })
    );
  }
}
