import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Logger } from '../shared/logger.service';
import { User } from '../user/user';
import { UserService } from '../user/user.service';
import { AuthenticationService } from '../auth/authentication.service';

@Component({
  selector: 'alm-app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})

export class HeaderComponent implements OnInit {
  title = 'Almighty';
  loggedInUser: User;
  loggedIn: Boolean = false;
  imgLoaded: Boolean = false;    

  constructor(
    private router: Router,
    private userService: UserService,
    private logger: Logger,
    private auth: AuthenticationService) {
  }

  getLoggedUser(): void {
    if (this.auth.isLoggedIn()) {
      this.userService
        .getUser()
        .then(user => this.loggedInUser = user);
    }
  }

  logout(){
    this.auth.logout();
  }

  login() {
    this.router.navigate(['login']);
  }

  ngOnInit(): void {        
    this.getLoggedUser();
    this.loggedIn = this.auth.isLoggedIn();
  }

  onImgLoad(){    
    this.imgLoaded = true;
  }

}
