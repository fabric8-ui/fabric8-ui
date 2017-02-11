import { ProfileService } from './../profile/profile.service';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { DummyService } from './../shared/dummy.service';
import { ContextType } from './../models/context-type';
import { Context } from './../models/context';
import { Logger } from '../shared/logger.service';
import { User } from '../models/user';
import { UserService } from '../shared/user.service';
import { AuthenticationService } from '../shared/authentication.service';
import { Broadcaster } from '../shared/broadcaster.service';
import { ContextService } from '../shared/context.service';

@Component({
  selector: 'alm-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  providers: []
})

export class HeaderComponent implements OnInit {
  title = 'Almighty';
  imgLoaded: Boolean = false;

  constructor(
    public router: Router,
    private userService: UserService,
    private logger: Logger,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    public dummy: DummyService,
    public context: ContextService,
    public profile: ProfileService
  ) {
    router.events.subscribe((val) => {
      if (val instanceof NavigationEnd) {
        this.onNavigate();
      }
    });
  }

  get loggedInUser(): User {
    return this.dummy.currentUser;
  }

  get loggedIn(): boolean {
    return this.auth.isLoggedIn();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/public']);
  }

  login() {
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    this.listenToEvents();
    //this.onNavigate();
  }

  onNavigate(): void {
    this.getLoggedUser();
    this.broadcaster.broadcast('navigate');
    if (this.context.current) {
      this.setActiveMenus(this.context.current);
    }
  }

  onImgLoad() {
    this.imgLoaded = true;
  }

  resetData(): void {
    this.imgLoaded = false;
  }

  listenToEvents() {
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.resetData();
      });
  }

  private getLoggedUser(): void {
    if (this.auth.isLoggedIn) {
      this.userService.getUser();
    }
  }

  private setActiveMenus(context: Context) {
    if ((<ContextType>context.type).menus) {
      for (let n of (<ContextType>context.type).menus) {
        // Clear the menu's active state
        n.active = false;
        if (n.menus) {
          for (let o of n.menus) {
            // Clear the menu's active state
            o.active = false;
            if (o.fullPath === this.router.url) {
              o.active = true;
              n.active = true;
            }
          }
        } else if (n.fullPath === this.router.url) {
          n.active = true;
        }
      }
    }
  }

}
