import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';
import { Subject } from 'rxjs';

import { Logger } from 'ngx-login-client';
import { Space, SpaceService, Context, Contexts } from 'ngx-fabric8-wit';



@Component({
  selector: 'alm-spaces',
  templateUrl: 'spaces.component.html',
  styleUrls: ['./spaces.component.scss'],
  providers: [SpaceService]
})
export class SpacesComponent implements OnInit {

  _spaces: Space[];
  pageSize: number = 20;
  searchTermStream = new Subject<string>();
  context: Context;

  constructor(
    private router: Router,
    private spaceService: SpaceService,
    private logger: Logger,
    private contexts: Contexts) {
      this.contexts.current.subscribe(val => this.context = val);
  }

  ngOnInit() {
    this.spaceService.getSpaces(this.pageSize)
      .subscribe(spaces => {
        this._spaces = spaces;
      });
    this.searchTermStream
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap((searchText: string) => {
        return this.spaceService.search(searchText);
      })
      .subscribe(values => {
        this._spaces = values;
      });
  }

  get spaces(): Space[] {
    return this._spaces;
  }

  searchSpaces(searchText: string) {
    this.searchTermStream.next(searchText);
  }
}
