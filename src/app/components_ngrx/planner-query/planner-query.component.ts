import { AfterViewChecked, Component, ElementRef, HostListener, OnDestroy, OnInit, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { sortBy } from 'lodash';
import { EmptyStateConfig } from 'patternfly-ng';
import { Observable } from 'rxjs';
import { SpaceQuery } from '../../models/space';
import { WorkItemQuery, WorkItemUI } from '../../models/work-item';
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
  styleUrls: ['./../planner-list/planner-list.component.less']
})
export class PlannerQueryComponent implements OnInit, OnDestroy, AfterViewChecked {
  @ViewChild('quickPreview') quickPreview: WorkItemPreviewPanelComponent;
  @ViewChild('listContainer') listContainer: ElementRef;
  @ViewChild('querySearch') querySearchRef: ElementRef;

  private workItems: Observable<WorkItemUI[]> = this.workItemQuery.getWorkItems();
  private uiLockedList: boolean = false;
  private emptyStateConfig: EmptyStateConfig;
  private contentItemHeight: number = 50;
  private columns: any[];
  private eventListeners: any[] = [];
  private hdrHeight: number = 0;
  private querySearchRefHt: number = 0;
  private searchQuery: string = '';

  constructor(
    private cookieService: CookieService,
    private spaceQuery: SpaceQuery,
    private router: Router,
    private route: ActivatedRoute,
    private workItemQuery: WorkItemQuery,
    private store: Store<AppState>,
    private filterService: FilterService,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.emptyStateConfig = {
      info: 'There are no Work Items for your selected criteria',
      title: 'No Work Items Available'
    } as EmptyStateConfig;
    this.eventListeners.push(
      this.spaceQuery.getCurrentSpace
      .do(() => {
        this.setDataTableColumns();
        this.checkURL();
      })
      .subscribe()
    );
  }

  ngOnDestroy() {
    this.eventListeners.forEach(e => e.unsubscribe());
  }

  checkURL() {
  // this.eventListeners.push(
  //   this.router.events
  //     .filter(event => event instanceof NavigationStart)
  //     .map((e: NavigationStart) => e.url)
  //     .subscribe(url => {
  //       if (url.indexOf('?q') > -1 &&
  //         url.indexOf('/plan/query') > -1) {
  //           console.log('#### - 0 url', url);
  //           if (this.searchQuery === '') {
  //             console.log('#### - 1 url', url);
  //           }
  //       }
  //     })
  // );

  this.eventListeners.push(
    this.route.queryParams
      .filter(params => params.hasOwnProperty('q'))
      .subscribe(params => {
        console.log('#### - 2 params', params, params.q);
        if (this.searchQuery === '') {
          this.searchQuery = params.q;
          console.log('### - input updated');
        }
        const filters = this.filterService.queryToJson(params.q);
        this.store.dispatch(new WorkItemActions.Get({
          pageSize: 200,
          filters: filters,
          isShowTree: false
        }));
      })
  );
}

  onPreview(id: string): void {
    // const workItem = this.workItems.find(w => w.id === id);
    // this.quickPreview.open(workItem);
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

  fetchWorkItemForQuery(query) {
    console.log(query);
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { q : query}
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
