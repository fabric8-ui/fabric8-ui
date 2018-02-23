import { Observable } from 'rxjs/Observable';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  OnDestroy,
  Output,
  ViewChild,
  ViewChildren,
  QueryList
} from '@angular/core';
import {
  animate,
  state,
  style,
  transition,
  trigger
} from '@angular/animations';
import { ActivatedRoute, Params, NavigationExtras } from '@angular/router';
import { Location }               from '@angular/common';
import { Router }                 from '@angular/router';
import { FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';

import { cloneDeep, trimEnd, merge, remove } from 'lodash';
import { Space, Spaces } from 'ngx-fabric8-wit';
import { Broadcaster, Logger } from 'ngx-base';
import {
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';

import { AreaUI } from '../../models/area.model';
import { IterationModel, IterationUI } from './../../models/iteration.model';
import { LabelSelectorComponent } from './../../components/label-selector/label-selector.component';
import { MarkdownControlComponent } from './../../components/markdown-control/markdown-control.component';
import { TypeaheadDropdown, TypeaheadDropdownValue } from './../../components/typeahead-dropdown/typeahead-dropdown.component';

import { CommentUI } from './../../models/comment';
import { WorkItem, WorkItemUI, WorkItemRelations } from '../../models/work-item';
import { UserUI } from '../../models/user';
import { LabelUI } from '../../models/label.model';
import { AssigneeSelectorComponent } from './../../components/assignee-selector/assignee-selector.component';
import { WorkItemService } from './../../services/work-item.service';

import {
  SelectDropdownComponent
} from './../../widgets/select-dropdown/select-dropdown.component';

//ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';
import * as CommentActions from './../../actions/comment.actions';

@Component({
  selector: 'work-item-preview',
  templateUrl: './work-item-quick-preview.component.html',
  styleUrls: ['./work-item-quick-preview.component.less'],
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

export class WorkItemQuickPreviewComponent implements OnInit, OnDestroy {

  @ViewChild('title') title: any;
  @ViewChild('userList') userList: any;
  @ViewChild('dropdownButton') dropdownButton: any;
  @ViewChild('areaSelectbox') areaSelectbox: TypeaheadDropdown;
  @ViewChild('iterationSelectbox') iterationSelectbox: TypeaheadDropdown;
  @ViewChild('labelSelector') labelSelector: LabelSelectorComponent;
  @ViewChild('assignee') assignee : any;
  @ViewChild('labelname') labelnameInput: ElementRef;
  @ViewChild('dropdown') dropdownRef: SelectDropdownComponent;
  @ViewChild('AssigneeSelector') AssigneeSelector: AssigneeSelectorComponent;
  @Input() selectedLabels: LabelUI[] = [];
  @Input() selectedAssignees: User[] = [];

  @Output() onOpenSelector: EventEmitter<any> = new EventEmitter();
  @Output() onCloseSelector: EventEmitter<LabelUI[]> = new EventEmitter();

  private spaceSource = this.store
    .select('listPage')
    .select('space')
    .filter(s => !!s);
  private areaSource = this.store
    .select('listPage')
    .select('areas')
    .filter(a => !!a);
  private iterationSource = this.store
    .select('listPage')
    .select('iterations')
    .filter(i => !!i.length);
  private labelSource = this.store
    .select('listPage')
    .select('labels')
    .filter(l => !!l.length);
  private collaboratorSource = this.store
    .select('listPage')
    .select('collaborators')
    .filter(c => !!c.length);
  private workItemStateSource = this.store
    .select('listPage')
    .select('workItemStates')
    .filter(wis => !!wis.length);
  private workItemCommentSource = this.store
    .select('detailPage')
    .select('comments');

  private collaborators: UserUI[] = [];
  private areasUI: AreaUI[] = [];
  private iterationUI: IterationUI[] = [];
  private workItem: WorkItemUI;
  private loggedIn: Boolean = false;
  private headerEditable: Boolean = false;
  private searchAssignee: Boolean = false;
  private loggedInUser: User;
  private panelState: string = 'out';
  private areas: TypeaheadDropdownValue[] = [];
  private iterations: TypeaheadDropdownValue[] = [];
  private eventListeners: any[] = [];
  private queryParams: Object = {};
  private labels: LabelUI[] = [];
  private workItemStates: string[] = [];
  private comments: CommentUI[] = [];

  private activeAddAssignee: boolean = false;
  private searchValue: string = '';

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private route: ActivatedRoute,
    private location: Location,
    private logger: Logger,
    private router: Router,
    private spaces: Spaces,
    private store: Store<AppState>,
    private userService: UserService,
    private workItemService: WorkItemService
  ) {}

  @HostListener('document:click', ['$event.target','$event.target.classList.contains('+'"assigned_user"'+')'])
  public onClick(targetElement,assigned_user) {
    if (this.assignee) {
      const clickedInsidePopup = this.assignee.nativeElement.contains(targetElement);
      if (!clickedInsidePopup&&!assigned_user) {
          this.cancelAssignment();
      }
    }
  }

  ngOnInit(): void {
    this.loggedIn = this.auth.isLoggedIn();
    this.listenToEvents();

    Observable.combineLatest(
      this.spaceSource,
      this.areaSource,
      this.iterationSource,
      this.labelSource,
      this.collaboratorSource,
      this.workItemStateSource
    ).take(1).subscribe(([
      spaceSource,
      areaSource,
      iterationSource,
      labelSource,
      collaboratorSource,
      workItemStateSource
    ]) => {
      this.collaborators = [...collaboratorSource];
      this.areasUI = [...areaSource];
      this.iterationUI = [...iterationSource];
      this.labels = [...labelSource];
      this.workItemStates = [...workItemStateSource];
      this.workItemCommentSource.subscribe(comments => {
        this.comments = [...comments];
        console.log('####-1', this.comments);
      })
    })
  }

  ngOnDestroy() {
    console.log('Destroying all the listeners in detail component');
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
  }

  openPreview(workitem) {
    if (!workitem) return;
    this.workItem = workitem;
    this.areas = this.extractAreaKeyValue(this.areasUI);
    this.iterations = this.extractIterationKeyValue(this.iterationUI);
    this.store.dispatch(new CommentActions.Get(this.workItem.commentLink));
    this.panelState = 'in';
  }

  closePreview() {
    this.panelState = 'out';
    this.eventListeners.forEach(subscriber => subscriber.unsubscribe());
    setTimeout(() => {
      this.workItem = null;
    }, 400);
  }

  showPreview(event: any): void {
    const rawText = event.rawText;
    const callBack = event.callBack;
    this.workItemService.renderMarkDown(rawText)
      .subscribe(renderedHtml => {
        callBack(
          rawText,
          renderedHtml
        );
      })
  }

  closeHeader(): void {
    this.headerEditable = false;
  }

  updateComment(comment) {
    // Nothing required here
  }

  closeDetails(): void {

  }

  listenToEvents() {
    this.eventListeners.push(
      this.broadcaster.on<string>('logout')
        .subscribe(message => {
          this.loggedIn = false;
          this.loggedInUser = null;
      })
    );
    if (this.loggedIn) {
      this.eventListeners.push(
        this.userService.loggedInUser.subscribe(user => {
          this.loggedInUser = user;
        })
      );
    }
    let id = null;
    this.eventListeners.push(
      this.spaces.current.subscribe(space => {
        this.closePreview();
      })
    );
  }

  preventDef(event: any) {
    event.preventDefault();
  }

  activeSearchAssignee() {
  }

  cancelAssignment(): void {
    this.searchAssignee = false;
  }

  closeUserRestFields(): void {
    this.searchAssignee = false;
    if (this.workItem && this.workItem.id != null) {
      this.headerEditable = false;
    }
    if (this.areaSelectbox && this.areaSelectbox.isOpen()) {
      this.areaSelectbox.close();
    }
    if (this.iterationSelectbox && this.iterationSelectbox.isOpen()) {
      this.iterationSelectbox.close();
    }
  }

  extractAreaKeyValue(areas: AreaUI[]): TypeaheadDropdownValue[] {
    let result: TypeaheadDropdownValue[] = [];
    let selectedFound: boolean = false;
    let selectedAreaId: string;
    if (this.workItem.area && this.workItem.area.id) {
      selectedAreaId = this.workItem.area.id;
    }
    for (let i=0; i<areas.length; i++) {
      result.push({
        key: areas[i].id,
        value: (areas[i].parentPathResolved !== '/' ? areas[i].parentPathResolved:'') + '/' + areas[i].name,
        selected: selectedAreaId === areas[i].id ? true : false,
        cssLabelClass: undefined
      });
      if (selectedAreaId === areas[i].id) {
        selectedFound = true;
      }
    };
    return result;
  }

  extractIterationKeyValue(iterations: IterationUI[]): TypeaheadDropdownValue[] {
    let result: TypeaheadDropdownValue[] = [];
    let selectedFound: boolean = false;
    let selectedIterationId;
    if (this.workItem.iteration && this.workItem.iteration.id) {
      selectedIterationId = this.workItem.iteration.id;
    }
    for (let i=0; i<iterations.length; i++) {
      result.push({
        key: iterations[i].id,
        value: (iterations[i].resolvedParentPath !== '/' ? iterations[i].resolvedParentPath:'') + '/' + iterations[i].name,
        selected: selectedIterationId === iterations[i].id ? true : false,
        cssLabelClass: undefined
      });
      if (selectedIterationId === iterations[i].id) {
        selectedFound = true;
      }
    };
    return result;
  }

  focusArea() {
    this.iterationSelectbox.close();
    this.cancelAssignment();
    this.areas = [
      ...this.areas,
      {
        key: '0',
        value: '',
        selected: false,
        cssLabelClass: 'spinner spinner-sm spinner-inline'
      }
    ];
    this.areas = this.extractAreaKeyValue(this.areasUI);
  }

  focusIteration() {
    this.areaSelectbox.close();
    this.cancelAssignment();
    this.iterations = [
      ...this.iterations,
      {
        key: '0',
        value: '',
        selected: false,
        cssLabelClass: 'spinner spinner-sm spinner-inline'
      }
    ];
    this.iterations = this.extractIterationKeyValue(this.iterationUI);
  }

  constructUrl(workItem: WorkItem) {
    return this.router.url.split('plan')[0] + 'plan/detail/' + workItem.number;
  }

  onLabelClick(event) {
    let params = {
      label: event.attributes.name
    }
    // Prepare navigation extra with query params
    let navigationExtras: NavigationExtras = {
      queryParams: params
    };

    // Navigated to filtered view
    this.router.navigate([], navigationExtras);
  }

  createComment(event: any) {
    const payload = {
      url: this.workItem.commentLink,
      comment: event
    };
    this.store.dispatch(new CommentActions.Add(payload));
  }

  @HostListener('window:keydown', ['$event'])
  onKeyEvent(event: any) {
    event = (event || window.event);
    // for ESC key handling
    if (event.keyCode == 27) {
      try {
        event.preventDefault(); //Non-IE
      } catch (x){
        event.returnValue = false; //IE
      }
      if (this.headerEditable) {
        this.closeHeader();
      } else if (this.searchAssignee) {
        this.searchAssignee = false;
      } else if (this.areaSelectbox && this.areaSelectbox.isOpen()) {
        this.areaSelectbox.close();
      } else if (this.iterationSelectbox && this.iterationSelectbox.isOpen()) {
        this.iterationSelectbox.close();
    } else {
        this.closePreview();
      }
    }
  }
  onOpen(event) {
    this.onOpenSelector.emit('open');
  }

  onClose(event) {
    this.onCloseSelector.emit(cloneDeep(this.selectedLabels));
  }

  openDropdown() {
    this.dropdownRef.openDropdown();
  }

  closeDropdown() {
    this.dropdownRef.closeDropdown();
  }
  closeAddAssignee() {
    this.activeAddAssignee = false;
  }
}
