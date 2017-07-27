import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Params, ActivatedRoute } from '@angular/router';
import { Component, OnInit, OnDestroy, Input, OnChanges } from '@angular/core';

import { Broadcaster, Logger } from 'ngx-base';
import { AuthenticationService } from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { GroupTypesService } from '../../services/group-types.service';
import { GroupTypesModel } from '../../models/group-types.model';
import { IterationModel } from '../../models/iteration.model';
import { IterationService } from '../../services/iteration.service';
import { WorkItem } from '../../models/work-item';
import { WorkItemType } from '../../models/work-item-type';

@Component({
  host: {
    'class':"app-component"
  },
  selector: 'group-types',
  templateUrl: './group-types-panel.component.html',
  styleUrls: ['./group-types-panel.component.less']
})
export class GroupTypesComponent implements OnInit, OnDestroy {

  authUser: any = null;
  loggedIn: Boolean = true;
  private spaceSubscription: Subscription = null;
  private groupTypes: GroupTypesModel[];
  private selectedgroupType: GroupTypesModel;
  private allowedChildWits: WorkItemType;

  constructor(
    private log: Logger,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private groupTypesService: GroupTypesService,
    private iterationService: IterationService,
    private route: ActivatedRoute,
    private spaces: Spaces
  ) {}

  ngOnInit(): void {
    this.loggedIn = this.auth.isLoggedIn();
    this.spaceSubscription = this.spaces.current.subscribe(space => {
      if (space) {
        console.log('[Guided Work Item Types] New Space selected: ' + space.attributes.name);
        this.groupTypesService.getGroupTypes()
        .subscribe(response => {
          console.log('response = ', response);
          this.groupTypes = response;
        });
      } else {
        console.log('[Guided Work Item Types] Space deselected.');
      }
    });
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.spaceSubscription.unsubscribe();
  }

  //Set the
  setContext(groupType) {
    //allowedChildWits
    //For a group type, we need to allow the highest level WITs
    //For portfolio, we need to show level 0 WITS and NOT level 1


  }

  setGroupType(groupType) {
    alert('Work in progress.');
    this.selectedgroupType = groupType;
    this.setContext(groupType);
    //this.groupTypesService.setCurrentGroupType(groupType);
  }
}
