import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Params, ActivatedRoute } from '@angular/router';
import { SpaceService, Space } from './../shared/mock-spaces.service';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Broadcaster } from './../shared/broadcaster.service';

@Component({
  selector: 'fab-planner-type',
  templateUrl: './type.component.html',
  styleUrls: ['./type.component.scss']
})
export class TypeComponent implements OnInit, OnDestroy {

  authUser: any = null;
  loggedIn: Boolean = false;
  private spaceSubscription: Subscription = null;

  constructor(
    private broadcaster: Broadcaster,
    private spaceService: SpaceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.spaceSubscription = this.spaceService.getCurrentSpaceBus().subscribe(space => console.log('[IterationComponent] New Space selected: ' + space.name));
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.spaceSubscription.unsubscribe();
  }
  getWorkItemsByType(type: string){
    let filters: any = [];
    filters.push({
      id:  type,
      name: type,
      paramKey: 'filter[workitemtype]',
      active: true,
      value: type
    });
    this.broadcaster.broadcast('unique_filter', filters);
  }
}
