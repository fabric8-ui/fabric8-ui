import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Broadcaster } from 'ngx-login-client';
import { Space } from 'ngx-fabric8-wit';

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
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.spaceSubscription = this.broadcaster.on<Space>("spaceChanged").subscribe(space => console.log('[IterationComponent] New Space selected: ' + space.name));
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
