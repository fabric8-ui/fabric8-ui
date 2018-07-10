import { Observable } from 'rxjs/Observable';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Spaces } from 'ngx-fabric8-wit';
import { AuthenticationService } from 'ngx-login-client';

import { GroupTypeUI } from '../../models/group-types.model';
import { WorkItemType } from '../../models/work-item-type';
import { FilterService } from '../../services/filter.service';
import { GroupTypesService } from '../../services/group-types.service';

// ngrx stuff
import { Store } from '@ngrx/store';
import * as GroupTypeActions from './../../actions/group-type.actions';
import { AppState } from './../../states/app.state';

@Component({
  selector: 'group-types',
  templateUrl: './group-types-panel.component.html',
  styleUrls: ['./group-types-panel.component.less']
})
export class GroupTypesComponent implements OnInit, OnDestroy {

  @Input() sidePanelOpen: boolean = true;
  @Input() context: 'list' | 'board'; // 'list' or 'board'

  authUser: any = null;
  infotipSource = this.store
  .select('planner')
  .select('infotips');
  private groupTypes: GroupTypeUI[];
  private selectedgroupType: GroupTypeUI;
  private allowedChildWits: WorkItemType;
  private spaceId;
  private eventListeners: any[] = [];
  private startedCheckingURL: boolean = false;
  private showTree: string = '';
  private showCompleted: string = '';

  constructor(
    private auth: AuthenticationService,
    private filterService: FilterService,
    private groupTypesService: GroupTypesService,
    private route: ActivatedRoute,
    private router: Router,
    private spaces: Spaces,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    const groupTypesData = this.store
      .select('planner')
      .select('groupTypes')
      .filter((types: GroupTypeUI[]) => !!types.length);
    const spaceData = this.store
      .select('planner')
      .select('space')
      .filter(space => space !== null);

    this.eventListeners.push(
      Observable.combineLatest(
        groupTypesData,
        spaceData
      ).subscribe(([types, space]) => {
        this.groupTypes = types as GroupTypeUI[];
        this.spaceId = space.id;
        if (!this.startedCheckingURL) {
          this.checkURL();
        }
      })
    );
  }

  ngOnDestroy() {
    this.eventListeners.forEach(e => e.unsubscribe());
  }

  fnBuildQueryParam(witGroup) {
    //Query for work item type group
    const type_query = this.filterService.queryBuilder(
      'typegroup.name', this.filterService.equal_notation, witGroup.name
    );
    //Query for space
    const space_query = this.filterService.queryBuilder(
      'space', this.filterService.equal_notation, this.spaceId
    );
    //Join type and space query
    const first_join = this.filterService.queryJoiner(
      {}, this.filterService.and_notation, space_query
    );
    const second_join = this.filterService.queryJoiner(
      first_join, this.filterService.and_notation, type_query
    );
    //second_join gives json object
    return this.filterService.jsonToQuery(second_join);
    //reverse function jsonToQuery(second_join);
  }

  addRemoveQueryParams(witGroup) {
    // If it's a board view then quoery should only have the board id
    if (this.context === 'board') {
      return {boardContextId: witGroup.id};
    }

    // For list view it works differently
    if (this.showCompleted && this.showTree) {
      return {
        q: this.fnBuildQueryParam(witGroup),
        showTree: this.showTree,
        showCompleted: this.showCompleted
      };
    } else if (this.showTree) {
      return {
        q: this.fnBuildQueryParam(witGroup),
        showTree: this.showTree
      };
    } else if (this.showCompleted) {
      return {
        q: this.fnBuildQueryParam(witGroup),
        showCompleted: this.showCompleted
      };
    } else {
      return {
        q: this.fnBuildQueryParam(witGroup)
      };
    }
  }

  checkURL() {
    this.startedCheckingURL = true;
    this.eventListeners.push(
      this.route.queryParams.subscribe(val => {
        if (val.hasOwnProperty('q')) {
          let selectedTypeGroup: GroupTypeUI;
          const selectedTypeGroupName =
            this.filterService.getConditionFromQuery(val.q, 'typegroup.name');
          if (selectedTypeGroupName) {
            selectedTypeGroup =
              this.groupTypes.find(g => g.name === selectedTypeGroupName);
          }
          if (selectedTypeGroup && !selectedTypeGroup.selected) {
            this.store.dispatch(new GroupTypeActions.SelectType(selectedTypeGroup));
          }
        }
        if (val.hasOwnProperty('showTree')) {
          this.showTree = val.showTree;
        } else {
          this.showTree = '';
        }
        if (val.hasOwnProperty('showCompleted')) {
          this.showCompleted = val.showCompleted;
        } else {
          this.showCompleted = '';
        }

        // If it's a board view then check for board context ID
        if (val.hasOwnProperty('boardContextId')) {
          const selectedTypeGroup: GroupTypeUI =
              this.groupTypes.find(g => g.id === val.boardContextId);
          if (selectedTypeGroup) {
            this.store.dispatch(new GroupTypeActions.SelectType(selectedTypeGroup));
          }
        }
      })
    );
  }

  getInfotipText(id: string) {
    return this.infotipSource
      .select(s => s[id])
      .select(i => i ? i['en'] : id);
  }

  //This function navigates to the desired work item group type page
  groupTypeClickHandler(e: MouseEvent, item: GroupTypeUI) {
    if (!e.srcElement.classList.contains('infotip-icon')) {
      let q = this.addRemoveQueryParams(item);
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: q
      });
    }
  }
}
