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
    private router: Router,
    private userService: UserService,
    private logger: Logger,
    private auth: AuthenticationService,
    private broadcaster: Broadcaster) {}

  getLoggedUser(): void {
    // TODO Dirty hack - remove this
    if (localStorage.getItem('auth_token') === 'pmuir') {
      this.userService.userData = new User();
      this.userService.userData.attributes = {
        fullName: 'Pete Muir',
        imageURL: 'https://avatars2.githubusercontent.com/u/157761?v=3&s=460'
      };
      this.userService.userData.id = '-1';
      this.userService.userData.type = 'identities';
      
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
    this.listenToEvents();
    this.getLoggedUser();
    this.loggedIn = this.auth.isLoggedIn();
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
}
