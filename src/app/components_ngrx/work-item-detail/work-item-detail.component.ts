import { UserUI } from './../../models/user';
import { AuthenticationService } from 'ngx-login-client';
import { UrlService } from './../../services/url.service';
import { GetWorkItem } from './../../actions/detail-work-item.actions';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AfterViewChecked,
  Component, Input, OnInit,
  OnDestroy, Output, EventEmitter,
  ElementRef, ViewChild, Renderer2
} from '@angular/core';

// ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';
import { WorkItemUI } from './../../models/work-item';
import * as WorkItemActions from './../../actions/work-item.actions';
import * as DetailWorkItemActions from './../../actions/detail-work-item.actions';
import * as IterationActions from './../../actions/iteration.actions';
import * as GroupTypeActions from './../../actions/group-type.actions';
import * as SpaceActions from './../../actions/space.actions';
import * as CollaboratorActions from './../../actions/collaborator.actions';
import * as AreaActions from './../../actions/area.actions';
import * as WorkItemTypeActions from './../../actions/work-item-type.actions';
import * as LabelActions from './../../actions/label.actions';

@Component({
  selector: 'work-item-detail',
  templateUrl: './work-item-detail.component.html',
  styleUrls: ['./work-item-detail.component.less']
})
export class WorkItemDetailComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('detailHeader') detailHeader: ElementRef;
  @ViewChild('detailContent') detailContent: ElementRef;

  private spaceSource = this.store
    .select('listPage')
    .select('space')
    .do(s => {if (!s) this.store.dispatch(new SpaceActions.Get())})
    .filter(s => !!s);
  private areaSource = this.store
    .select('listPage')
    .select('areas')
    .do(a => {if (!a.length) this.store.dispatch(new AreaActions.Get())})
    .filter(a => !!a.length);
  private iterationSource = this.store
    .select('listPage')
    .select('iterations')
    .do(i => {if (!i.length) this.store.dispatch(new IterationActions.Get())})
    .filter(i => !!i.length);
  private labelSource = this.store
    .select('listPage')
    .select('labels')
    .do(i => {if (!i.length) this.store.dispatch(new LabelActions.Get())})
    .filter(l => !!l.length);
  private collaboratorSource = this.store
    .select('listPage')
    .select('collaborators')
    .do(i => {if (!i.length) this.store.dispatch(new CollaboratorActions.Get())})
    .filter(c => !!c.length);
  private workItemStateSource = this.store
    .select('listPage')
    .select('workItemStates')
    .filter(wis => !!wis.length);
  private workItemTypeSource = this.store
    .select('listPage')
    .select('workItemTypes')
    .do(i => {if (!i.length) this.store.dispatch(new WorkItemTypeActions.Get())})
    .filter(w => !!w.length);
  private workItemCommentSource = this.store
    .select('detailPage')
    .select('comments');
  private workItemSource: Observable<WorkItemUI> =
    this.store
      .select('detailPage')
      .select('workItem');

  private combinedSources = Observable.combineLatest(
    this.areaSource, this.iterationSource,
    this.labelSource, this.collaboratorSource,
    this.workItemStateSource, this.workItemTypeSource
  );

  @Input('workItem') set workItemInput(val: WorkItemUI) {
    if (val) {
      if (this.workItemSubscriber !== null) {
        this.workItemSubscriber.unsubscribe();
        this.workItemSubscriber = null;
      }
      this.detailContext = 'preview';
      const workItemNumber = val.number;
      this.setWorkItem(workItemNumber);
    }
  }

  @Output() closePreview: EventEmitter<any> = new EventEmitter();

  private workItem: WorkItemUI = null;
  private detailContext: 'preview' | 'detail' = 'preview';
  private eventListeners: any[] = [];
  private workItemSubscriber: any = null;
  private workItemStates: string[] = [];
  private collaborators: UserUI[] = [];
  private loggedIn: boolean = false;
  private titleCallback = null;

  private loadingComments: boolean = true;
  private loadingTypes: boolean = false;
  private loadingIteration: boolean = false;
  private loadingArea: boolean = false;
  private loadingLabels: boolean = false;
  private loadingAssignees: boolean = false;
  private loggedInUser: UserUI = null;

  constructor(
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private urlService: UrlService,
    private auth: AuthenticationService,
    private renderer: Renderer2
  ) {

  }

  ngOnInit() {
    const currentRoute = this.router.url;
    this.loggedIn = this.auth.isLoggedIn();
    if (currentRoute.includes('plan/detail/')) {
      this.detailContext = 'detail';
      const workItemNumber = currentRoute.split('plan/detail/')[1];
      this.setWorkItem(workItemNumber);
    }
  }

  ngOnDestroy() {
    this.eventListeners.forEach(e => e.unsubscribe());
    if (this.workItemSubscriber !== null) {
      this.workItemSubscriber.unsubscribe();
      this.workItemSubscriber = null;
    }
  }

  ngAfterViewChecked() {
    if(this.detailHeader) {
      let HdrDivHeight:any =  this.detailHeader.nativeElement.offsetHeight;
      let targetHeight:any = window.innerHeight - HdrDivHeight - 90;
      this.renderer.setStyle(this.detailContent.nativeElement, 'height', targetHeight + "px");
    }
    if(document.getElementsByTagName('body')) {
      document.getElementsByTagName('body')[0].style.overflow = "hidden";
    }
  }

  setWorkItem(wiNumber: string | number) {
    this.workItemSubscriber =
      this.spaceSource
      .switchMap(s => {
        return this.combinedSources
      })
      .switchMap(([areas, iterations, labels, collabs, states, type]) => {
        this.workItemStates = states;
        this.collaborators = collabs.filter(c => !c.currentUser);
        this.loggedInUser = collabs.find(c => c.currentUser);
        this.store.dispatch(new DetailWorkItemActions.GetWorkItem({
          number: wiNumber
        }));
        return this.workItemSource;
      })
      .subscribe(workItem => {
        this.workItem = workItem;
        this.loadingAssignees = false;
        // set title on update
        if (this.titleCallback !== null) {
          this.titleCallback(this.workItem.title);
          this.titleCallback = null;
        }
      });
  }

  closeDetail() {
    if (this.workItemSubscriber !== null) {
      this.workItemSubscriber.unsubscribe();
      this.workItemSubscriber = null;
    }
    if (this.detailContext === 'detail') {
      this.navigateBack();
    } else {
      this.closePreview.emit();
    }
  }

  navigateBack() {
    if (this.urlService.getLastListOrBoard() === '') {
      this.router.navigate(['../..'], { relativeTo: this.route });
    } else {
      this.router.navigateByUrl(this.urlService.getLastListOrBoard());
    }
  }

  constructUrl(workItem: WorkItemUI) {
    return this.router.url.split('plan')[0] + 'plan/detail/' + workItem.number;
  }

  saveTitle(event) {
    const value = event.value.trim();
    this.titleCallback = event.callBack;
    if (value !== '' && this.workItem.title !== value) {
      let workItem = {} as WorkItemUI;
      workItem['version'] = this.workItem.version;
      workItem['link'] = this.workItem.link;
      workItem['id'] = this.workItem.id;

      workItem['title'] = value;
      this.store.dispatch(new WorkItemActions.Update(workItem));
    }
  }

  onChangeState(state) {
    if (state !== this.workItem.state) {
      let workItem = {} as WorkItemUI;
      workItem['version'] = this.workItem.version;
      workItem['link'] = this.workItem.link;
      workItem['id'] = this.workItem.id;

      workItem['state'] = state;
      this.store.dispatch(new WorkItemActions.Update(workItem));
    }
  }

  assignUser(users) {
    this.loadingAssignees = true;
    let workItem = {} as WorkItemUI;
    workItem['version'] = this.workItem.version;
    workItem['link'] = this.workItem.link;
    workItem['id'] = this.workItem.id;

    workItem['assignees'] = users;
    this.store.dispatch(new WorkItemActions.Update(workItem));
  }
}
