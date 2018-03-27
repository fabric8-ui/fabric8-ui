import { UrlService } from './../../services/url.service';
import { Observable } from 'rxjs/Observable';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  OnDestroy,
  Renderer2,
  ViewEncapsulation,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
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
import { CookieService } from './../../services/cookie.service';
import { cloneDeep, sortBy, isEqual } from 'lodash';
import { EmptyStateConfig } from 'patternfly-ng/empty-state';

// import for column
import { datatableColumn } from './../../components/planner-list/datatable-config';

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
import { WorkItemUI } from '../../models/work-item';
import * as WorkItemActions from './../../actions/work-item.actions';
import { WorkItemPreviewPanelComponent } from '../work-item-preview-panel/work-item-preview-panel.component';

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {
    'class': ''
  },
  selector: 'alm-work-item-list',
  templateUrl: './planner-list.component.html',
  styleUrls: ['./planner-list.component.less']
})

export class PlannerListComponent implements OnInit, OnDestroy, AfterViewChecked {
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
    .do(s => {if (!s) this.store.dispatch(new SpaceActions.Get())})
    .filter(s => !!s);
  private areaSource = this.store
    .select('listPage')
    .select('areas')
    .filter(a => !!a.length);
  private iterationSource = this.store
    .select('listPage')
    .select('iterations')
    .filter(i => !!i.length)
  private labelSource = this.store
    .select('listPage')
    .select('labels')
    .filter(i => i !== null)
  private collaboratorSource = this.store
    .select('listPage')
    .select('collaborators')
    .filter(c => !!c.length);
  private selectedIterationSource = this.store
    .select('listPage')
    .select('iterations')
    .filter(its => !!its.length)
    .map(its => its.find(it => it.selected));
  private workItemSource = this.store
    .select('listPage')
    .select('workItems');
  private routeSource = this.route.queryParams
    .filter(p => p.hasOwnProperty('q'));
  private quickAddWorkItemTypes: WorkItemTypeUI[] = [];
  private allWorkItemTypes: WorkItemTypeUI[] = [];
  private selectedIteration: IterationUI = null;
  private loggedIn: boolean = true;
  private eventListeners: any[] = [];
  private columns: any[] = [];
  private isTableConfigOpen: boolean = false;
  private workItems: WorkItemUI[] = [];
  private contentItemHeight: number = 50;
  private selectedRows: any = [];
  private detailExpandedRows: any = [];
  private showTree: boolean = false;
  private showTreeUI: boolean = false;
  private emptyStateConfig: any = {};
  private uiLockedList: boolean = false;
  private uiLockedSidebar: boolean = false;
  private hdrHeight: number = 0;
  private toolbarHt: number = 0;
  private quickaddHt: number = 0;

  @ViewChild('plannerLayout') plannerLayout: PlannerLayoutComponent;
  @ViewChild('toolbar') toolbar: ElementRef;
  @ViewChild('quickaddWrapper') quickaddWrapper: ElementRef;
  @ViewChild('listContainer') listContainer: ElementRef;
  @ViewChild('myTable') table: any;
  @ViewChild('quickPreview') quickPreview: WorkItemPreviewPanelComponent;

  constructor(
    private renderer: Renderer2,
    private store: Store<AppState>,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private filterService: FilterService,
    private cookieService: CookieService,
    private urlService: UrlService
  ) {}

  ngOnInit() {
    const payload = {};
    let newFilterObj = {};
    this.emptyStateConfig = {
      info: 'There are no Work Items for your selected criteria',
      title: 'No Work Items Available'
    } as EmptyStateConfig;

    this.eventListeners.push(
      this.spaceSource
      .do(() => {
        this.uiLockedSidebar = true;
        this.uiLockedList = true;
      })
      .switchMap(s => {
        return Observable.combineLatest(
          this.workItemTypeSource,
          this.areaSource,
          this.iterationSource.take(1),
          this.labelSource.take(1),
          this.collaboratorSource,
          this.routeSource
        );
      })
      .subscribe(([
        workItemTypeSource,
        areaSource,
        iterationSource,
        labelSource,
        collaboratorSource,
        queryParams
      ]) => {
        this.uiLockedSidebar = false;
        this.uiLockedList = true;
        let exp = this.filterService.queryToJson(queryParams.q);
        // Check for tree view
        if (queryParams.hasOwnProperty('showTree') && queryParams.showTree) {
          this.showTree = true;
          exp['$OPTS'] = {'tree-view': true};
        } else {
          this.showTree = false;
          exp['$OPTS'] = {'tree-view': false};
        }


        Object.assign(payload, {
          expression: exp
        });
        this.store.dispatch(new WorkItemActions.Get({
          pageSize: 200,
          filters: payload,
          isShowTree: this.showTree
        }))
      })
    );

    const queryParams = this.route.snapshot.queryParams;
    if(Object.keys(queryParams).length === 0 ||
      ( Object.keys(queryParams).length === 1 &&  // for in memory
        Object.keys(queryParams).indexOf('token_json') > -1)) {
      this.setDefaultUrl();
    }
    this.loggedIn = this.auth.isLoggedIn();
    this.setWorkItemTypes();
    this.setSelectedIterationForQuickAdd();
    this.setWorkItems();
    this.setDataTableColumns();

    // Listen for the url change
    this.eventListeners.push(
      this.router.events
        .filter(event => event instanceof NavigationStart)
        .subscribe(
        (event: any) => {
          if (event.url.indexOf('/plan/detail/') > -1) {
            // It's going to the detail page
            let url = location.pathname;
            let query = location.href.split('?');
            if (query.length == 2) {
              url = url + '?' + query[1];
            }
            this.urlService.recordLastListOrBoard(url);
          }
        }
        )
    );
  }

   //ngx-datatable methods
   handleReorder(event) {
    if(event.newValue !== 0) {
      this.columns[event.prevValue - 1].index = event.newValue;
      this.columns[event.newValue - 1].index = event.prevValue;
      this.columns = sortBy(this.columns, 'index');
      this.cookieService.setCookie('datatableColumn', this.columns);
    }
  }

  // Start: Settings(tableConfig) dropdown

  toggleCheckbox(event, col) {
    if(event.target.checked) {
      col.selected = true;
    } else {
      col.selected = false;
    }
  }

  moveToDisplay() {
    this.columns.filter(col => col.selected).forEach(col => {
      if(col.display === true) return;
      col.selected = false;
      col.display = true;
      col.showInDisplay = true;
      col.available = false;
    })
    this.updateColumnIndex();
    this.cookieService.setCookie('datatableColumn', this.columns);
  }

  moveToAvailable() {
    this.columns.filter(col => col.selected).forEach(col => {
      if(col.available === true) return;
      col.selected = false;
      col.display = false;
      col.showInDisplay = false;
      col.available = true;
    });
    this.updateColumnIndex();
    this.cookieService.setCookie('datatableColumn', this.columns);
  }

  updateColumnIndex() {
    let index = 0;
    this.columns.forEach(col => {
      if(col.display === true) {
        col.index = index + 1;
        index += 1;
      } else {
        col.index = undefined;
      }
    });
    this.columns = sortBy(this.columns, 'index');
  }

  tableConfigChange(value: boolean) {
    this.isTableConfigOpen = value;
  }

  tableConfigToggle(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isTableConfigOpen = false;
  }

  // End:  Setting(tableConfig) Dropdown

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
    setTimeout(() => {
    this.workItems = [...this.workItems];
    }, 500);
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
              const type_query = this.filterService.queryBuilder('typegroup.name', this.filterService.equal_notation, defaultGroupName);
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
                queryParams: { q: query, showTree: true }
              });
            });
        }
      });
  }

  setWorkItemTypes() {
    this.eventListeners.push(
      Observable.combineLatest(
        this.workItemTypeSource,
        this.groupTypeSource
      ).subscribe(([workItemTypes, groupTypes]) => {
        this.allWorkItemTypes = workItemTypes;
        const selectedGroupType = groupTypes.find(gt => gt.selected);
        if (selectedGroupType) {
          this.quickAddWorkItemTypes = workItemTypes.filter(type => {
            return selectedGroupType
              .typeList.findIndex(t => t.id === type.id) > -1;
          })
        } else {
          this.quickAddWorkItemTypes = workItemTypes;
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

  /**
   * This function listens for any change in
   * work item state and adopt it
  */
  setWorkItems() {
    this.eventListeners.push(
      this.workItemSource
        .subscribe(workItems => {
          this.uiLockedList = false;
          this.showTreeUI = this.showTree;
          this.workItems = [...workItems];
        })
    );
  }

  setDataTableColumns() {
    // Cookie for datatableColumn config
    if(!this.cookieService.getCookie(datatableColumn.length).status) {
      this.cookieService.setCookie('datatableColumn', datatableColumn);
      this.columns = datatableColumn;
    } else {
      let temp = this.cookieService.getCookie(datatableColumn.length)
      this.columns = temp.array;
    }
  }

  onSelect({ selected }) {
    // if (this.detailExpandedRows.length > 0 && this.detailExpandedRows[0].id !== selected[0].id) {
    //   this.table.rowDetail.collapseAllRows();
    //   this.detailExpandedRows = [];
    // }
    // this.workItemDataService.getItem(selected[0].id).subscribe(workItem => {
    //   this.workItemService.emitSelectedWI(workItem);
    // });
  }

  onScroll(event) {
    // if (event.path &&
    //     this._lastCheckedScrollHeight < event.path[0].scrollHeight) {
    //   let scrollLeft = ((event.path[0].scrollHeight -
    //     (event.path[0].offsetHeight + event.path[0].scrollTop)) * 100) /
    //     event.path[0].scrollHeight;
    //   if (scrollLeft <= this._scrollTrigger) {
    //     this._lastCheckedScrollHeight = event.path[0].scrollHeight;
    //     this.fetchMoreWiItems();
    //   }
    // }
  }

  onTreeAction(event: any) {
    const index = event.rowIndex;
    const row = event.row;
    if (this.workItems[index].treeStatus === 'collapsed') {
      this.workItems[index].treeStatus = 'loading';
      if (!this.workItems[index].childrenLoaded) {
        this.loadChildren(this.workItems[index]);
      } else {
        this.workItems[index].treeStatus = 'expanded';
        this.workItems = [...this.workItems];
      }
    } else {
      this.workItems[index].treeStatus = 'collapsed';
      this.workItems = [...this.workItems];
    }
  }

  loadChildren(workItem: WorkItemUI) {
    this.store.dispatch(
      new WorkItemActions.GetChildren(workItem)
    );
  }

  toggleExpandRow(row, quickAddEnabled = true) {
    if (quickAddEnabled && this.loggedIn) {
      const index = this.detailExpandedRows.findIndex(r => r.id === row.id);
      if (index > -1) {
        // For collapsing
        this.table.rowDetail.toggleExpandRow(this.detailExpandedRows[index]);
        this.detailExpandedRows.splice(index, 1);
      } else {
        // For expanding
        this.detailExpandedRows.forEach(r => {
          this.table.rowDetail.toggleExpandRow(r);
        });
        this.detailExpandedRows = [];
        this.table.rowDetail.toggleExpandRow(row);
        this.detailExpandedRows.push(row);
      }
    }
  }

  onCreateStart() {
    this.detailExpandedRows = [];
  }

  onClickLabel(event) {
    const labelId = event.id;
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    const newQuery = this.filterService.queryBuilder(
      'label',
      this.filterService.equal_notation,
      labelId
    );
    let existingQuery = {};
    if (queryParams.hasOwnProperty('q')) {
      existingQuery = this.filterService.queryToJson(queryParams['q']);
    }
    const finalQuery = this.filterService.jsonToQuery(
      this.filterService.queryJoiner(
        existingQuery,
        this.filterService.and_notation,
        newQuery
      )
    );
    queryParams['q'] = finalQuery;
    // Navigated to filtered view
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: queryParams
    });
  }

  onPreview(id: string): void {
    const workItem = this.workItems.find(w => w.id === id);
    this.quickPreview.open(workItem);
  }

  onRowDrop(event) {
    console.log(event);
    if(event.source.id === event.target.id) {
      return;
    }
    this.uiLockedList = true;
    const payload =  {
      workitem: event.source,
      destinationWorkitemID: event.target.id,
      direction: 'above'
    }
    this.store.dispatch(new WorkItemActions.Reoder(payload));
  }

  ngOnDestroy() {
    this.eventListeners.forEach(e => e.unsubscribe());
  }

  ngAfterViewChecked() {
    if(document.getElementsByClassName('navbar-pf').length > 0) {
      this.hdrHeight = (document.getElementsByClassName('navbar-pf')[0] as HTMLElement).offsetHeight;
    }
    if(this.toolbar) {
      this.toolbarHt =  this.toolbar.nativeElement.offsetHeight;
    }
    if(this.quickaddWrapper) {
      this.quickaddHt =  this.quickaddWrapper.nativeElement.offsetHeight;
    }
    let targetHeight = window.innerHeight - (this.hdrHeight + this.toolbarHt + this.quickaddHt + 25); // add 25 for experimental bar height
    if(this.listContainer) {
      this.renderer.setStyle(this.listContainer.nativeElement, 'height', targetHeight + "px");
    }
    // This hack is applied to get the titles in the list in order
    if (document.getElementsByClassName('planner-hack-title-truncate').length) {
      let arr = document.getElementsByClassName('planner-hack-title-truncate');
      for(let i = 0; i < arr.length; i++) {
        arr[i].parentElement.style.display = 'flex';
      }
    }
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {}
}
