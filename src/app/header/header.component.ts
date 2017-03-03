import { Observable } from 'rxjs/Observable';
import { AstronautService } from './../shared/astronaut.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import {
  AuthenticationService,
  Broadcaster,
  Logger,
  User,
  UserService
} from 'ngx-login-client';

import { SpaceService, Space } from 'ngx-fabric8-wit';

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

  /*
    public tabs: Array<any> = [
      {title: 'Home', content: 'Home content 1', active: true},
      {title: 'Work', content: 'Work content 2'},
      {title: 'Code', content: 'Code content 2'},
      {title: 'Test', content: 'Test content 3'},
      {title: `Environments/Pipelines`, content: 'Environments/Pipelines content 4'},
      {title: 'Hypothesis Engine <sup><span class="fa fa-trademark"></span></sup>', content: 'hypo content 4'}
    ];

    public alertMe(): void {
      setTimeout(function (): void {
        alert('You\'ve selected the alert tab!');
      });
    };

    public setActiveTab(index: number): void {
      this.tabs[index].active = true;
    };

    public removeTabHandler(/!*tab:any*!/): void {
      console.log('Remove Tab handler');
    };
  */

  constructor(
    private router: Router,
    private userService: UserService,
    private logger: Logger,
    private auth: AuthenticationService,
    private astronaut: AstronautService,
    private broadcaster: Broadcaster) { }

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
    // First, populate the list with all spaces
    let allSpaces = this.astronaut.getAllSpaces();
    allSpaces.subscribe(val => {
      this.spaces = val;
      if (val && val.length > 0) {
        // Set an initial space
        this.broadcaster.broadcast('spaceChanged', val[0]);
        this.selectedSpace = val[0];
      }
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
  }

  onSpaceChange(newSpace: Space) {
    if (newSpace) {
      this.logger.log('Selected new Space: ' + newSpace.id);
      this.astronaut.switchToSpace(newSpace);
    } else {
      this.logger.log('Deselected Space.');
      this.astronaut.switchToSpace(null);
    }
  }
}
