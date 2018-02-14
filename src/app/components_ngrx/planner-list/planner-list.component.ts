import { Observable } from 'rxjs/Observable';
import {
  Component,
  ElementRef,
  OnInit,
  OnDestroy,
  Renderer2,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PlannerLayoutComponent } from './../../widgets/planner-layout/planner-layout.component';
import { Space } from 'ngx-fabric8-wit';
import { WorkItemTypeUI } from '../../models/work-item-type';
import {
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';
import { IterationUI } from './../../models/iteration.model';
import { FilterService } from './../../services/filter.service';

// ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';
// import * as actions from './../../actions/index.actions';
import * as IterationActions from './../../actions/iteration.actions';
import * as GroupTypeActions from './../../actions/group-type.actions';
import * as SpaceActions from './../../actions/space.actions';
import * as CollaboratorActions from './../../actions/collaborator.actions';
import * as AreaActions from './../../actions/area.actions';
import * as WorkItemTypeActions from './../../actions/work-item-type.actions';
import * as LabelActions from './../../actions/label.actions';

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': ''
  },
  selector: 'alm-work-item-list',
  templateUrl: './planner-list.component.html',
  styleUrls: ['./planner-list.component.less']
})

export class PlannerListComponent implements OnInit, OnDestroy {
  private uiLockedAll: boolean = false;
  private sidePanelOpen: boolean = true;
  private groupTypeSource = this.store
    .select('listPage')
    .select('groupTypes')
    .filter(g => !!g.length);
  private workItemTypeSource = this.store
    .select('listPage')
    .select('workItemTypes')
    .filter(w => !!w.length);
  private spaceSource = this.store
    .select('listPage')
    .select('space')
    .filter(s => !!s);
  private selectedIterationSource = this.store
    .select('listPage')
    .select('iterations')
    .filter(its => !!its.length)
    .map(its => its.find(it => it.selected));
  private workItemTypes: WorkItemTypeUI[] = [];
  private selectedIteration: IterationUI = null;
  private loggedIn: boolean = true;
  private eventListeners: any[] = [];

  @ViewChild('plannerLayout') plannerLayout: PlannerLayoutComponent;
  @ViewChild('containerHeight') containerHeight: ElementRef;

  constructor(
    private renderer: Renderer2,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.resizeHeight();
    }, 200);
    window.addEventListener("resize", () => {
      this.resizeHeight()
    });
    this.store.dispatch(new SpaceActions.Get());

    this.spaceSource
      .subscribe((space: Space) => {
        this.store.dispatch(new IterationActions.Get());
        this.store.dispatch(new GroupTypeActions.Get());
        this.store.dispatch(new CollaboratorActions.Get());
        this.store.dispatch(new AreaActions.Get());
        this.store.dispatch(new WorkItemTypeActions.Get());
        this.store.dispatch(new LabelActions.Get());
      });

    const queryParams = this.route.snapshot.queryParams;
    if(Object.keys(queryParams).length === 0 && process.env.ENV != 'inmemory') {
      this.setDefaultUrl();
    }
    this.loggedIn = this.auth.isLoggedIn();
    this.setWorkItemTypesForQuickAdd();
    this.setSelectedIterationForQuickAdd();
  }

  resizeHeight() {
    const navElemnts = document.getElementsByTagName('nav');
    const navHeight = navElemnts[0].offsetHeight;
    const totalHeight = window.innerHeight;
    this.renderer.setStyle(
      this.containerHeight.nativeElement,
      'height',
      (totalHeight - navHeight) + "px");
  }

  togglePanelState(event) {
    if (event === 'out') {
      setTimeout(() => {
        this.sidePanelOpen = true;
      }, 200)
    } else {
      this.sidePanelOpen = false;
    }
  }

  togglePanel() {
    this.plannerLayout.toggleSidePanel();
  }

  setDefaultUrl() {
    //redirect to default type group
    //get space id
    this.spaceSource
      .take(1)
      .subscribe(space => {
        if (space) {
          const spaceId = space.id;
          //get groupsgroups
          this.groupTypeSource
            .take(1)
            .subscribe(groupTypes => {
              const defaultGroupName = groupTypes[0].name;
              //Query for work item type group
              const type_query = this.filterService.queryBuilder('$WITGROUP', this.filterService.equal_notation, defaultGroupName);
              //Query for space
              const space_query = this.filterService.queryBuilder('space',this.filterService.equal_notation, spaceId);
              //Join type and space query
              const first_join = this.filterService.queryJoiner({}, this.filterService.and_notation, space_query );
              const second_join = this.filterService.queryJoiner(first_join, this.filterService.and_notation, type_query );
              //const view_query = this.filterService.queryBuilder('tree-view', this.filterService.equal_notation, 'true');
              //const third_join = this.filterService.queryJoiner(second_join);
              //second_join gives json object
              let query = this.filterService.jsonToQuery(second_join);
              console.log('query is ', query);
              // { queryParams : {q: query}
              this.router.navigate([], {
                relativeTo: this.route,
                queryParams: { q: query }
              });
            });
        }
      });
  }

  setWorkItemTypesForQuickAdd() {
    this.eventListeners.push(
      Observable.combineLatest(
        this.workItemTypeSource,
        this.groupTypeSource
      ).subscribe(([workItemTypes, groupTypes]) => {
        const selectedGroupType = groupTypes.find(gt => gt.selected);
        if (selectedGroupType) {
          this.workItemTypes = workItemTypes.filter(type => {
            return selectedGroupType
              .typeList.findIndex(t => t.id === type.id) > -1;
          })
        } else {
          this.workItemTypes = workItemTypes;
        }
      })
    );
  }

  setSelectedIterationForQuickAdd() {
    this.eventListeners.push(
      this.selectedIterationSource
        .subscribe(iteration => {
          this.selectedIteration = iteration;
        })
    )
  }

  ngOnDestroy() {
    this.eventListeners.forEach(e => e.unsubscribe());
  }
}
