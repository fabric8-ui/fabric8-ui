import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Params, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, Input } from '@angular/core';

import { Broadcaster, Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { FilterService } from '../../services/filter.service';
import { GroupTypesService } from '../../services/group-types.service';
import { GroupTypesModel } from '../../models/group-types.model';
import { IterationModel } from '../../models/iteration.model';
import { WorkItem } from '../../models/work-item';
import { WorkItemType } from '../../models/work-item-type';

@Component({
  selector: 'group-types',
  templateUrl: './group-types-panel.component.html',
  styleUrls: ['./group-types-panel.component.less']
})
export class GroupTypesComponent implements OnInit, OnDestroy {

  @Input() iterations: IterationModel[] = [];
  @Input() sidePanelOpen: Boolean = true;
  @Input('groupTypes') set groupTypesSetup(types: GroupTypesModel[]) {
    if(JSON.stringify(this.groupTypes) != JSON.stringify(types)) {
      this.groupTypes = types;
      this.selectedgroupType = types[0];
    }
  }

  authUser: any = null;
  loggedIn: Boolean = true;
  private spaceSubscription: Subscription = null;
  private groupTypes: GroupTypesModel[];
  private selectedgroupType: GroupTypesModel;
  private allowedChildWits: WorkItemType;
  eventListeners: any[] = [];
  private spaceId;

  constructor(
    private log: Logger,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private filterService: FilterService,
    private groupTypesService: GroupTypesService,
    private route: ActivatedRoute,
    private spaces: Spaces
  ) {}

  ngOnInit(): void {
    this.loggedIn = this.auth.isLoggedIn();
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      if (space) {
        this.spaceId = space.id;
      } else {
        console.log('[Guided Work Item Types] Space deselected.');
      }
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.spaceSubscription.unsubscribe();
  }

  fnBuildQueryParam(witGroup) {
    //Query for work item type group
    const type_query = this.filterService.queryBuilder('$WITGROUP', this.filterService.equal_notation, witGroup.attributes.name);
    //Query for space
    const space_query = this.filterService.queryBuilder('space',this.filterService.equal_notation, this.spaceId);
    //Join type and space query
    const first_join = this.filterService.queryJoiner({}, this.filterService.and_notation, space_query );
    const second_join = this.filterService.queryJoiner(first_join, this.filterService.and_notation, type_query );
    //second_join gives json object
    return this.filterService.jsonToQuery(second_join);
    //reverse function jsonToQuery(second_join);
  }

  setGuidedTypeWI(witGroup: GroupTypesModel) {
    if(witGroup !== this.selectedgroupType) {
      this.selectedgroupType = witGroup;
      let matchingWITGroup = this.groupTypes.find(gt => {
        return gt.id === witGroup.id;
      });
      let witIdArray = matchingWITGroup.relationships.typeList.data
        .map(wit => wit.id);
      this.groupTypesService.setCurrentGroupType(witIdArray, matchingWITGroup.attributes.bucket);
    }
  }
}
