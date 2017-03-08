import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Broadcaster } from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';

@Component({
  host:{
      'class':"app-component"
  },
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
    private route: ActivatedRoute,
    private spaces: Spaces
  ) {}

  ngOnInit(): void {
    this.spaceSubscription = this.spaces.current.subscribe(space =>  {
      if (space) {
        console.log('[IterationComponent] New Space selected: ' + space.attributes.name);
      } else {
        console.log('[IterationComponent] Space deselected.');
      }
    });
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
