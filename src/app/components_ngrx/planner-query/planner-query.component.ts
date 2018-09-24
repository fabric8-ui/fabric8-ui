import { AfterViewChecked, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { sortBy } from 'lodash';
import { cloneDeep, isEqual } from 'lodash';
import { EmptyStateConfig } from 'patternfly-ng';
import { combineLatest, Observable } from 'rxjs';
import { filter, startWith, switchMap, tap } from 'rxjs/operators';
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

  workItemsSource: Observable<WorkItemUI[]> = combineLatest(
    this.spaceQuery.getCurrentSpace.pipe(filter(s => !!s)),
    this.route.queryParams.pipe(filter(q => !!q)),
    // Wait untill workItemTypes are loaded
    this.workItemTypeQuery.getWorkItemTypes().pipe(filter(wt => !!wt.length)))
    .pipe(
      tap((i) => this.setDataTableColumns()),
      switchMap(([space, query]) => {
        if (query.hasOwnProperty('q')) {
          this.searchQuery = query.q;
          this.disableInput = false;
          this.currentQuery = this.breadcrumbsText('', query);
          const filters = this.filterService.queryToJson(query.q);
          this.store.dispatch(new WorkItemActions.Get({
            pageSize: 200,
            filters: filters,
            isShowTree: false
          }));
        }
        if (query.hasOwnProperty('prevq')) {
          this.breadcrumbs = JSON.parse(query.prevq);
        }
        return this.workItemQuery.getWorkItems();
      }),
      startWith([])
    );
  public currentQuery: string;
  public breadcrumbs: any[] = [];
  public disableInput: boolean;
  public uiLockedList: boolean = false;
  public emptyStateConfig: EmptyStateConfig;
  public contentItemHeight: number = 50;
  public columns: any[];
  public selectedRows: any = [];
  public searchQuery: string = '';
  public _lastCheckedScrollHeight: any;
  public _scrollTrigger: number;
  public headerHeight: number = 30;
  public targetHeight: number;

  private eventListeners: any[] = [];
  private hdrHeight: number = 0;
  private querySearchRefHt: number = 0;

  constructor(
    private cookieService: CookieService,
    private spaceQuery: SpaceQuery,
    private router: Router,
    private route: ActivatedRoute,
    private workItemQuery: WorkItemQuery,
    private store: Store<AppState>,
    private filterService: FilterService,
    private renderer: Renderer2,
    private workItemTypeQuery: WorkItemTypeQuery,
    private el: ElementRef
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
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    if (keycode === 13 && query !== '') {
      if (queryParams.hasOwnProperty('prevq')) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
             q : query,
             prevq: queryParams.prevq
            }
        });
      } else {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: { q : query}
        });
    }
    } else if (keycode === 8 && (event.ctrlKey || event.metaKey)) {
      this.searchQuery = '';
    }
  }

  onChildExploration(workItem: WorkItemUI) {
    let queryParams = cloneDeep(this.route.snapshot.queryParams);
    let previousQuery;
    if (queryParams.hasOwnProperty('prevq')) {
      if (queryParams.hasOwnProperty('q')) {
        previousQuery = {
          prevq: [
            ...JSON.parse(queryParams.prevq),
            {q: queryParams.q}
          ]
        };
      }
    } else {
      previousQuery = {prevq: [queryParams]};
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        q: 'parent.number : ' + workItem.number,
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

  breadcrumbsText(index, query) {
    const parentNumber = this.filterService.isOnlyChildQuery(query.q);
    if (parentNumber !== null) {
      return `Query ${index === '' ? '' : '-'} ${index} (Child of #${parentNumber})`;
    } else {
      return `Query ${index === '' ? '' : '-'} ${index}`;
    }
  }

  onScroll(event, numberOfWorkItems) {
    console.log('############ - 1', event);
    // if (event.path &&
    //     this._lastCheckedScrollHeight < event.path[0].scrollHeight) {
    //       console.log('###### - 2');
    //   let scrollLeft = ((event.path[0].scrollHeight -
    //     (event.path[0].offsetHeight + event.path[0].scrollTop)) * 100) /
    //     event.path[0].scrollHeight;
    //   if (scrollLeft <= this._scrollTrigger) {
    //     this._lastCheckedScrollHeight = event.path[0].scrollHeight;
    //     this.store.dispatch(new WorkItemActions.GetMoreWorkItems({
    //       isShowTree: false
    //     }));
    //   }
    // }
    const viewHeight = this.targetHeight - this.headerHeight;
    console.log('####### - 2', viewHeight);
    if (event.offsetY + viewHeight >= numberOfWorkItems * this.contentItemHeight) {
      console.log('####### - 3');
      this.store.dispatch(new WorkItemActions.GetMoreWorkItems({
        isShowTree: false
      }));
    }
  }

  ngAfterViewChecked() {
    if (document.getElementsByClassName('navbar-pf').length > 0) {
      this.hdrHeight = (document.getElementsByClassName('navbar-pf')[0] as HTMLElement).offsetHeight;
    }
    if (this.querySearchRef) {
      this.querySearchRefHt = this.querySearchRef.nativeElement.offsetHeight;
    }
    this.targetHeight = window.innerHeight - (this.hdrHeight + this.querySearchRefHt);
    if (this.listContainer) {
      this.renderer.setStyle(this.listContainer.nativeElement, 'height', this.targetHeight + 'px');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {}
}
