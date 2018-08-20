import { AfterViewChecked, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { sortBy } from 'lodash';
import { cloneDeep, isEqual } from 'lodash';
import { EmptyStateConfig } from 'patternfly-ng';
import { Observable } from 'rxjs';
import { SpaceQuery } from '../../models/space';
import { WorkItemQuery, WorkItemUI } from '../../models/work-item';
import { WorkItemTypeQuery } from '../../models/work-item-type';
import { CookieService } from '../../services/cookie.service';
import { FilterService } from '../../services/filter.service';
import { AppState } from '../../states/app.state';
import { datatableColumn } from '../planner-list/datatable-config';
import * as WorkItemActions from  './../../actions/work-item.actions';
import { WorkItemPreviewPanelComponent } from './../work-item-preview-panel/work-item-preview-panel.component';
@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'planner-query',
  templateUrl: './planner-query.component.html',
  styleUrls: ['./planner-query.component.less']
})
export class PlannerQueryComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('quickPreview') quickPreview: WorkItemPreviewPanelComponent;
  @ViewChild('listContainer') listContainer: ElementRef;
  @ViewChild('querySearch') querySearchRef: ElementRef;

  workItemsSource: Observable<WorkItemUI[]> = Observable.combineLatest(
    this.spaceQuery.getCurrentSpace.filter(s => !!s),
    this.route.queryParams.filter(q => !!q),
    // Wait untill workItemTypes are loaded
    this.workItemTypeQuery.getWorkItemTypes().filter(wt => !!wt.length))
    .do((i) => this.setDataTableColumns())
    .switchMap(([space, query]) => {
      if (query.hasOwnProperty('q')) {
        this.searchQuery = query.q;
        this.disableInput = false;
        this.currentQuery = 'Query';
        const filters = this.filterService.queryToJson(query.q);
        this.store.dispatch(new WorkItemActions.Get({
          pageSize: 200,
          filters: filters,
          isShowTree: false
        }));
      } else if (query.hasOwnProperty('parentId')) {
        this.disableInput = true;
        this.searchQuery = 'Children of ' + query.parentId;
        this.currentQuery = query.parentId;

        // FIXME: This is temporary untill we have support for parent.id/number in search endpoint
        const payload = space.links.self.split('spaces')[0] + 'workitems/' + query.parentId + '/children';
        this.store.dispatch(new WorkItemActions.GetWorkItemChildrenForQuery(payload));
      }
      if (query.hasOwnProperty('prevq')) {
        this.breadcrumbs = JSON.parse(query.prevq);
      }
      return this.workItemQuery.getWorkItems();
    })
    .startWith([]);
  currentQuery: string;
  breadcrumbs: any[] = [];
  disableInput: boolean;
  private uiLockedList: boolean = false;
  private emptyStateConfig: EmptyStateConfig;
  private contentItemHeight: number = 50;
  private columns: any[];
  private selectedRows: any = [];
  private eventListeners: any[] = [];
  private hdrHeight: number = 0;
  private querySearchRefHt: number = 0;
  private searchQuery: string = '';
  private childrenApiUrl: string;

  constructor(
    private cookieService: CookieService,
    private spaceQuery: SpaceQuery,
    private router: Router,
    private route: ActivatedRoute,
    private workItemQuery: WorkItemQuery,
    private store: Store<AppState>,
    private filterService: FilterService,
    private renderer: Renderer2,
    private workItemTypeQuery: WorkItemTypeQuery
  ) {}

  ngOnInit() {
    this.emptyStateConfig = {
      info: 'There are no Work Items for your selected criteria',
      title: 'No Work Items Available'
    } as EmptyStateConfig;
    this.store.dispatch(new WorkItemActions.ResetWorkItems());
  }

  ngOnDestroy() {
    this.store.dispatch(new WorkItemActions.ResetWorkItems());
    this.eventListeners.forEach(e => e.unsubscribe());
  }

  onPreview(workItem: WorkItemUI): void {
    this.quickPreview.open(workItem);
  }

  setDataTableColumns() {
    // Cookie for datatableColumn config
    if (!this.cookieService.getCookie(datatableColumn.length).status) {
      this.cookieService.setCookie('datatableColumn', datatableColumn);
      this.columns = datatableColumn;
    } else {
      let temp = this.cookieService.getCookie(datatableColumn.length);
      this.columns = temp.array;
    }
  }


  //ngx-datatable methods
  handleReorder(event) {
    if (event.newValue !== 0) {
      this.columns[event.prevValue - 1].index = event.newValue;
      this.columns[event.newValue - 1].index = event.prevValue;
      this.columns = sortBy(this.columns, 'index');
      this.cookieService.setCookie('datatableColumn', this.columns);
    }
  }

  // Start: Settings(tableConfig) dropdown
  moveToDisplay(columns) {
    this.columns = [...columns];
    this.cookieService.setCookie('datatableColumn', this.columns);
    // setTimeout(() => {
    //   this.workItems = [...this.workItems];
    // }, 500);
  }

  moveToAvailable(columns) {
    this.cookieService.setCookie('datatableColumn', columns);
    this.columns = [...columns];
  }
  // End:  Setting(tableConfig) Dropdown

  fetchWorkItemForQuery(event: KeyboardEvent, query: string) {
    let keycode = event.keyCode ? event.keyCode : event.which;
    if (keycode === 13 && query !== '') {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q : query}
      });
    } else if (keycode === 8 && (event.ctrlKey || event.metaKey)) {
      this.searchQuery = '';
    }
  }

  onChildExploration(workItem: WorkItemUI) {
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    let previousQuery;
    if (queryParams.hasOwnProperty('prevq')) {
      if (queryParams.hasOwnProperty('parentId')) {
        previousQuery = {
          prevq: [
            ...JSON.parse(queryParams.prevq),
            {
              parentId: queryParams.parentId
            }
          ]
        };
      } else if (queryParams.hasOwnProperty('q')) {
        previousQuery = {
          prevq: [
            ...JSON.parse(queryParams.prevq),
            {
              q: queryParams.q
            }
          ]
        };
      }
    } else {
      previousQuery = {prevq: [queryParams]};
    }
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        parentId: workItem.id
        ,
        prevq: JSON.stringify(previousQuery.prevq)
      }
    });
  }

  navigateToQuery(query) {
    const index = this.breadcrumbs.findIndex((c) => isEqual(c, query));
    const prevq = [...this.breadcrumbs.slice(0, index)];
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams:  {
        ...query,
        prevq: JSON.stringify(prevq)
      }
    });
  }

  ngAfterViewChecked() {
    if (document.getElementsByClassName('navbar-pf').length > 0) {
      this.hdrHeight = (document.getElementsByClassName('navbar-pf')[0] as HTMLElement).offsetHeight;
    }
    if (this.querySearchRef) {
      this.querySearchRefHt = this.querySearchRef.nativeElement.offsetHeight;
    }
    let targetHeight = window.innerHeight - (this.hdrHeight + this.querySearchRefHt);
    if (this.listContainer) {
      this.renderer.setStyle(this.listContainer.nativeElement, 'height', targetHeight + 'px');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {}
}
