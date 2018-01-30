import { cloneDeep } from 'lodash';
import _ from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Params, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnChanges } from '@angular/core';

import { AuthenticationService } from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { FilterService } from '../../services/filter.service';
import { GroupTypesService } from '../../services/group-types.service';
import { GroupTypesModel, GroupTypeUI } from '../../models/group-types.model';
import { WorkItemType } from '../../models/work-item-type';

// ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';
import * as GroupTypeActions from './../../actions/group-type.actions';

@Component({
  selector: 'group-types',
  templateUrl: './group-types-panel.component.html',
  styleUrls: ['./group-types-panel.component.less']
})
export class GroupTypesComponent implements OnInit {

  @Input() sidePanelOpen: boolean = true;

  authUser: any = null;
  private groupTypes: GroupTypeUI[];
  private selectedgroupType: GroupTypeUI;
  private allowedChildWits: WorkItemType;
  private spaceId;
  private eventListeners: any[] = [];
  private startedCheckingURL: boolean = false;

  constructor(
    private auth: AuthenticationService,
    private filterService: FilterService,
    private groupTypesService: GroupTypesService,
    private route: ActivatedRoute,
    private spaces: Spaces,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    const groupTypesData = this.store
      .select('listPage')
      .select('groupTypes')
      .filter((types: GroupTypeUI[]) => !!types.length);
    const spaceData = this.store
      .select('listPage')
      .select('space')
      .filter(space => space !== null)

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

  fnBuildQueryParam(witGroup) {
    //Query for work item type group
    const type_query = this.filterService.queryBuilder(
      '$WITGROUP', this.filterService.equal_notation, witGroup.name
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

  checkURL() {
    this.startedCheckingURL = true;
    this.eventListeners.push(
      this.route.queryParams.subscribe(val => {
        if (val.hasOwnProperty('q')) {
          const selectedTypeGroupName =
            this.filterService.getConditionFromQuery(val.q, '$WITGROUP');
          const selectedTypeGroup =
            this.groupTypes.find(g => g.name === selectedTypeGroupName);
          if (!selectedTypeGroup.selected) {
            this.store.dispatch(new GroupTypeActions.SelectType(selectedTypeGroup));
          }
        }
      })
    );
  }
}
