import { DummySpace } from './DummySpace.service';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthenticationService,
  Broadcaster,
  Logger,
  User,
  UserService
} from 'ngx-login-client';

import { Space } from 'ngx-fabric8-wit';

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

  spaces: Space[] = [];
  selectedSpace: Space = null;

  constructor(
    private router: Router,
    private userService: UserService,
    private logger: Logger,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private spaceService: DummySpace) { }

  getLoggedUser(): void {
    this.loggedInUser = this.userService.getSavedLoggedInUser();
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
    this.broadcaster.on<Space>('spaceChanged').subscribe(val => this.selectedSpace = val);
    this.spaceService.getAllSpaces().then((spaces) => {
      this.spaces = spaces;
      this.selectedSpace = spaces[0];
      this.onSpaceChange(this.selectedSpace);
    })
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
  }

  onSpaceChange(newSpace: Space) {
    if (newSpace) {
      this.logger.log('Selected new Space: ' + newSpace.id);
      this.broadcaster.broadcast('spaceChanged', newSpace);
    } else {
      this.logger.log('Deselected Space.');
      this.broadcaster.broadcast('spaceChanged', null);
    }
  }
}
