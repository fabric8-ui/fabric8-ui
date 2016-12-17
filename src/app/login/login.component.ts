import { Component, OnInit } from '@angular/core';
import { Router }    from '@angular/router';

import { LoginItem } from './login-item';
import { LoginService } from './login.service';
import { AuthenticationService } from '../auth/authentication.service';


@Component({
  selector: 'alm-login-form',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginItem: LoginItem;
  showError: boolean = false;
  feedbackMessage: string = '';
  statusCode: number = 0;

  constructor(
    private auth: AuthenticationService,
    private router: Router,
    private loginService: LoginService) {
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['home'], {});
    }
  }

  gitSignin() {
    this.loginService.gitHubSignIn();
  }

  checkStatus(loginStatus: any){
    if (loginStatus.token) {
      this.router.navigate(['home'], {});
    } else {
      this.statusCode = loginStatus.status;
      this.feedbackMessage = loginStatus.responseText;
      this.showError = true;
    }
  }

  closeAlert(){
    this.showError = false;
  }
}
