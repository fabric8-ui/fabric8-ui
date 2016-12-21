import { ContextMenuItem } from './../models/context-menu-item';
import { DummyService } from './../dummy/dummy.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Logger } from '../shared/logger.service';
import { User } from '../models/user';
import { UserService } from '../user/user.service';
import { AuthenticationService } from '../auth/authentication.service';
import { Broadcaster } from '../shared/broadcaster.service';

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
    public router: Router,
    private userService: UserService,
    private logger: Logger,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    public dummy: DummyService) {}

  getLoggedUser(): void {
    if (this.loggedIn) {
      this.userService.getUser();
    }
    this.loggedInUser = this.userService.getSavedLoggedInUser();
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/public']);
  }

  login() {
    this.router.navigate(['login']);
  }

  ngOnInit(): void {
    this.loggedIn = this.auth.isLoggedIn();
    this.listenToEvents();
    this.getLoggedUser();
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

  context(): ContextMenuItem {
    // Find the most specific context menu path and display it
    // TODO This is brittle
    let defaultItem;
    let ret;
    for (let m of this.dummy.contextMenuItems) {
      if (this.router.url.startsWith(m.path)) {
        if (ret == null || m.path.length > ret.path.length) {
          ret = m;
        }
      }
      if (m.default) {
        defaultItem = m;
      }
    }
    return ret || defaultItem;
  }
}
