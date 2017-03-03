import { AstronautService } from './../shared/astronaut.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Params, ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Broadcaster } from 'ngx-login-client';
import { SpaceService, Space } from 'ngx-fabric8-wit';

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
    private astronaut: AstronautService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.spaceSubscription = this.broadcaster.on<Space>('spaceChanged').subscribe(space =>  {
      if (space) {
        console.log('[IterationComponent] New Space selected: ' + space.name);
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
