import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LoginItem } from '../models/login-item';
import { LoginService } from '../shared/login.service';
import { AuthenticationService } from '../shared/authentication.service';
import { ProfileService } from './../profile/profile.service';
import { UserService } from './../shared/user.service';



@Component({
  selector: 'alm-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  loginItem: LoginItem;
  showError: boolean = false;
  feedbackMessage: string = '';
  statusCode: number = 0;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private loginService: LoginService,
    private profile: ProfileService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      if (this.profile.checkProfileSufficient()) {
        this.router.navigate(['home']);
      } else {
        this.router.navigate(['signup']);
      }
    }
  }

  gitSignin() {
    this.loginService.gitHubSignIn();
  }

  checkStatus(loginStatus: any) {
    if (loginStatus.token) {
      this.router.navigate(['home']);
    } else {
      this.statusCode = loginStatus.status;
      this.feedbackMessage = loginStatus.responseText;
      this.showError = true;
    }
  }

  closeAlert() {
    this.showError = false;
  }
}
