import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, Subject } from 'rxjs';
import { cloneDeep } from 'lodash';

import { Broadcaster } from 'ngx-base';
import { Contexts, SpaceService, Space, Spaces } from 'ngx-fabric8-wit';
import { UserService } from 'ngx-login-client';

import { SpaceNamespaceService } from './../../shared/runtime-console/space-namespace.service';
import { DummyService } from './../shared/dummy.service';

@Component({
  selector: 'fabric8-edit-space-description-widget',
  templateUrl: './edit-space-description-widget.component.html',
  styleUrls: ['./edit-space-description-widget.component.scss']
})
export class EditSpaceDescriptionWidgetComponent implements OnInit {

  space: Space;

  private _descriptionUpdater: Subject<string> = new Subject();

  constructor(
    private spaces: Spaces,
    private contexts: Contexts,
    private userService: UserService,
    private broadcaster: Broadcaster,
    private spaceService: SpaceService,
    private spaceNamespaceService: SpaceNamespaceService
  ) {
    spaces.current.subscribe(val => {
      this.space = val;
      console.log('newspace', val);
    });
  }

  ngOnInit() {
    this._descriptionUpdater
      .debounceTime(1000)
      .map(description => {
        let patch = {
          attributes: {
            description: description,
            name: this.space.attributes.name,
            version: this.space.attributes.version
          },
          type: 'spaces',
          id: this.space.id
        } as Space;
        return patch;
      })
      .do(val => console.log(val))
      .switchMap(patch => this.spaceService
        .update(patch)
        .do(val => console.log('updatedspace', val))
        .do(updated => this.broadcaster.broadcast('spaceUpdated', updated))
        .switchMap(updated => this.spaceNamespaceService.updateConfigMap(Observable.of(updated)))
      )
      .subscribe();
  }

  saveDescription($event) {
    this._descriptionUpdater.next($event);
  }

  isEditable(): Observable<boolean> {
    return Observable.combineLatest(
      this.contexts.current.map(val => val.user.id),
      this.userService.loggedInUser.map(val => val.id),
      (a, b) => (a === b)
    );
  }

}
