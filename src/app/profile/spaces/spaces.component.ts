import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { Logger } from 'ngx-login-client';
import { Space, SpaceService } from 'ngx-fabric8-wit';

import { DummyService } from './../../shared/dummy.service';


@Component({
  selector: 'alm-spaces',
  templateUrl: 'spaces.component.html',
  styleUrls: ['./spaces.component.scss'],
  providers: [SpaceService]
})
export class SpacesComponent implements OnInit {

  _spaces: Space[];
  pageSize: number = 20;

  constructor(
    private router: Router, public dummy: DummyService, private spaceService: SpaceService, private logger: Logger) {
  }

  ngOnInit() {
    this.spaceService.getSpaces(this.pageSize)
      .then((spaces) => {
        this._spaces = spaces;
      })
      .catch((e) => this.logger.error(e));
  }

  get spaces(): Space[] {
    return this._spaces;
  }
}
