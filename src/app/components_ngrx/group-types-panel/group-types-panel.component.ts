import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Params, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';

import { AuthenticationService } from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { FilterService } from '../../services/filter.service';
import { GroupTypesService } from '../../services/group-types.service';
import { GroupTypesModel, GroupTypeUI } from '../../models/group-types.model';
import { WorkItemType } from '../../models/work-item-type';

// ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';


@Component({
  selector: 'group-types',
  templateUrl: './group-types-panel.component.html',
  styleUrls: ['./group-types-panel.component.less']
})
export class GroupTypesComponent implements OnInit, OnDestroy {

  @Input() sidePanelOpen: boolean = true;

  authUser: any = null;
  private spaceSubscription: Subscription = null;
  private groupTypes: GroupTypeUI[];
  private selectedgroupType: GroupTypeUI;
  private allowedChildWits: WorkItemType;
  private spaceId;

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

    Observable.combineLatest(
      groupTypesData,
      spaceData
    ).subscribe(([types, space]) => {
      this.groupTypes = types as GroupTypeUI[];
      this.spaceId = space.id;
    })
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.spaceSubscription.unsubscribe();
  }

  fnBuildQueryParam(wit) {
    //this.filterService.queryBuilder({}, '$IN',)
    const wi_key = 'workitemtype';
    const wi_compare = this.filterService.in_notation;
    const wi_value = wit.wit_collection;

    //Query for type
    const type_query = this.filterService.queryBuilder(wi_key, wi_compare, wi_value);
    //Query for space
    const space_query = this.filterService.queryBuilder('space', this.filterService.equal_notation, this.spaceId);
    //Join type and space query
    const first_join = this.filterService.queryJoiner({}, this.filterService.and_notation, space_query );
    const second_join = this.filterService.queryJoiner(first_join, this.filterService.and_notation, type_query );
    this.setGroupType(wit);
    //second_join gives json object
    return this.filterService.jsonToQuery(second_join);
    //reverse function jsonToQuery(second_join);
  }


  setGroupType(groupType: GroupTypeUI) {
    this.selectedgroupType = groupType;
  }

  setGuidedTypeWI(groupType: GroupTypeUI) {
    let gType;
    let gt;
    this.groupTypesService.getGroupTypes()
      .subscribe(response => {
        gType = response;
      });
    gt = groupType;
    if(groupType.group == 'portfolio') {
      gt = gType.find(groupType => groupType.group == 'portfolio' && groupType.level[1] == 0);
    }
    this.groupTypesService.setCurrentGroupType(gt.wit_collection, gt.group);
  }
}
