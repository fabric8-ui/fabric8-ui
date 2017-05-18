import { SpacesService } from '../mock/standalone/spaces.service';
import { DummySpace } from './DummySpace.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Broadcaster, Logger } from 'ngx-base';
import {
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';

import { Space, Spaces, SpaceService } from 'ngx-fabric8-wit';

@Component({
  selector: 'alm-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})

export class HeaderComponent implements OnInit {
  title = 'Almighty';
  loggedInUser: User;
  loggedIn: Boolean = false;
  imgLoaded: Boolean = false;
  followQueryParams: Object = {};

  spaces: Space[] = [];
  selectedSpace: Space = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private logger: Logger,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private spaceService: DummySpace,
    private spacesService: SpacesService) { }

  getLoggedUser(): void {
    this.userService.getUser().subscribe(user => this.loggedInUser = user);
  }

  logout() {
    this.auth.logout();
  }

  login() {
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    this.listenToEvents();
    this.getLoggedUser();
    this.loggedIn = this.auth.isLoggedIn();
    this.spacesService.current.subscribe(val => this.selectedSpace = val);
    this.spaceService.getAllSpaces().subscribe((spaces) => {
      this.spaces = spaces as Space[];
      this.selectedSpace = spaces[0];
      this.onSpaceChange(this.selectedSpace);
    });
  }

  onImgLoad() {
    this.imgLoaded = true;
  }

  resetData(): void {
    this.loggedInUser = null as User;
    this.loggedIn = false;
    this.imgLoaded = false;
  }

  listenToEvents() {
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.resetData();
      });

    this.broadcaster.on<any>('authenticationError')
      .subscribe(() => {
        this.logout();
        this.router.navigate(['/login']);
      });

    this.route.queryParams.subscribe(params => {
      this.followQueryParams = {};
      if (Object.keys(params).indexOf('iteration') > -1) {
        this.followQueryParams['iteration'] = params['iteration'];
      }
    })
  }

  onSpaceChange(newSpace: Space) {
    if (newSpace) {
      this.logger.log('Selected new Space: ' + newSpace.id);
      this.spacesService.setCurrent(newSpace);
    } else {
      this.logger.log('Deselected Space.');
      this.spacesService.setCurrent(null);
    }
  }
}
