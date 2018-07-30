import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { sortBy } from 'lodash';
import { DragulaService } from 'ng2-dragula';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { BoardQuery, BoardUIQuery } from '../../models/board.model';
import { cleanObject } from '../../models/common.model';
import { WorkItemQuery, WorkItemUI } from '../../models/work-item';
import { FilterService } from '../../services/filter.service';
import { AppState } from '../../states/app.state';
import * as BoardUIActions from './../../actions/board-ui.actions';
import * as ColumnWorkItemAction from './../../actions/column-workitem.action';
import { GroupTypeQuery, GroupTypeUI } from './../../models/group-types.model';
import { IterationQuery } from './../../models/iteration.model';
import { SpaceQuery } from './../../models/space';
import { WorkItemPreviewPanelComponent } from './../work-item-preview-panel/work-item-preview-panel.component';


@Component({
    selector: 'planner-board',
    templateUrl: './planner-board.component.html',
    styleUrls: ['./planner-board.component.less']
})
export class PlannerBoardComponent implements AfterViewChecked, OnInit, OnDestroy {
    @ViewChild('boardContainer') boardContainer: ElementRef;
    @ViewChild('quickPreview') quickPreview: WorkItemPreviewPanelComponent;


    private uiLockedSidebar: boolean = false;
    private sidePanelOpen: boolean = true;
    private eventListeners: any[] = [];
    private board$;
    private columns;
    private destroy$ = new Subject();

    constructor(
      private dragulaService: DragulaService,
      private renderer: Renderer2,
      private spaceQuery: SpaceQuery,
      private groupTypeQuery: GroupTypeQuery,
      private iterationQuery: IterationQuery,
      private boardQuery: BoardQuery,
      private route: ActivatedRoute,
      private store: Store<AppState>,
      private router: Router,
      private workItemQuery: WorkItemQuery,
      private boardUiQuery: BoardUIQuery,
      private filterService: FilterService
    ) {
      const bag: any = this.dragulaService.find('board-column');
      if (bag !== undefined) {
        this.dragulaService.destroy('board-column');
      }
      this.dragulaService.drop.asObservable().takeUntil(this.destroy$).subscribe((value) => {
        this.onDrop(value.slice(1));
      });
      // card is not draggable if loggedInUser is not collaborator or creator of workItem
      this.dragulaService.setOptions('board-column', {
        moves: (el, source, handle, sibling) => {
          return !el.classList.contains('item-not-draggable');
        }
      });
    }

    ngOnInit() {
      this.iterationQuery.deselectAllIteration();
      this.eventListeners.push(
        this.spaceQuery.getCurrentSpace
          .switchMap(() => {
            return this.groupTypeQuery.getFirstGroupType;
          }).take(1)
          .do((groupType) => {
            this.setDefaultUrl(groupType);
            this.checkUrl(groupType);
          })
          .subscribe()
      );
    }

    setDefaultUrl(groupType: GroupTypeUI) {
      const queryParams = this.constructUrl(groupType);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { q: queryParams }
      });
    }

    constructUrl(witGroup: GroupTypeUI) {
       //Query for work item type group
      const type_query = this.filterService.queryBuilder(
          'boardContextId', this.filterService.equal_notation, witGroup.id
        );
      //Query for space
      //Join type and space query
      const first_join = this.filterService.queryJoiner(
        {}, this.filterService.and_notation, type_query
      );
      //second_join gives json object
      return this.filterService.jsonToQuery(first_join);
      //reverse function jsonToQuery(second_join);
    }

    checkUrl(groupType) {
      this.eventListeners.push(
        this.router.events
          .filter(event => event instanceof NavigationStart)
          .map((e: NavigationStart) => e.url)
          .subscribe(url => {
            if (url.indexOf('?q') === -1 &&
              url.indexOf('/plan/board') > -1) {
              this.setDefaultUrl(groupType);
            }
          })
      );

      this.eventListeners.push(
        this.route.queryParams
          .filter(params => params.hasOwnProperty('q'))
          .map(params => {
            let iterationId = this.filterService.getConditionFromQuery(params.q, 'iteration');
            if (iterationId !== undefined) {
              return [this.filterService.getConditionFromQuery(params.q, 'boardContextId'), iterationId];
            } else {
              const contextId = this.filterService.queryToFlat(params.q)[0].value;
              return [contextId];
            }
          })
          .subscribe(ids => {
            // ids[0]: boardContextId, ids[1]: iteration
            if (ids.length > 1) {
              this.board$ = this.boardQuery.getBoardById(ids[0], ids[1]);
            } else {
              this.board$ = this.boardQuery.getBoardById(ids[0]);
            }
            // Fetching work item
            // Dispatch action to fetch work items per lane for this context ID
          })
      );
    }

    ngOnDestroy() {
      this.destroy$.next();
      this.eventListeners.forEach(e => e.unsubscribe());
    }

    ngAfterViewChecked() {
      let hdrHeight = 0;
      if (document.getElementsByClassName('navbar-pf').length > 0) {
        hdrHeight = (document.getElementsByClassName('navbar-pf')[0] as HTMLElement).offsetHeight;
      }
      let targetHeight = window.innerHeight - (hdrHeight);

      if (this.boardContainer) {
        this.renderer.setStyle(
          this.boardContainer.nativeElement, 'height', targetHeight + 'px'
        );
      }
    }

    togglePanelState(event) {
      setTimeout(() => {
        this.sidePanelOpen = event === 'out';
      }, 200);
    }

    openQuickPreview(workItem: WorkItemUI) {
      this.quickPreview.open(workItem);
    }

    onDrop(args) {
      const [el, target, source, sibling] = args;
      let direction: string | null;
      let destinationWorkItemID: string;
      if (sibling === null && el.previousElementSibling !== null) {
        direction = 'below';
        destinationWorkItemID = el.previousElementSibling.children[0].getAttribute('data-id');
      } else if (sibling !== null) {
        direction = 'above';
        destinationWorkItemID = sibling.children[0].getAttribute('data-id');
      } else if (sibling === null && el.previousElementSibling === null) {
        // no reorder action dispatch only update action will dispatch
        direction = null;
      }
      this.workItemQuery.getWorkItemWithId(el.children[0].getAttribute('data-id'))
        .take(1)
        .subscribe((workItem: WorkItemUI) => {
          let workitem = {} as WorkItemUI;
          workitem['version'] = workItem.version;
          workitem['link'] = workItem.link;
          workitem['id'] = workItem.id;
          workitem['type'] = workItem.type;
          // Construct the payload for Reorder
          const payload = {
            workitem: workitem,
            destinationWorkitemID: destinationWorkItemID,
            direction: direction
          };
          workitem.columnIds = [target.getAttribute('data-id')];
          this.store.dispatch(new ColumnWorkItemAction.Update(
            {
              workItem: workitem,
              reorder: payload,
              prevColumnId: source.getAttribute('data-id')
            }
          ));
          this.store.dispatch(
            new BoardUIActions.LockBoard()
          );
      });
    }
}
