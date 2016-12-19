import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';

import { LoginService } from '../login/login.service';


@Component({
  selector: 'alm-public',
  templateUrl: './public.component.html',
  styleUrls: ['./public.component.scss']
})
export class PublicComponent implements OnInit {

  constructor(
    private router: Router,
    private loginService: LoginService) {
  }

  ngOnInit() {
    
  }

  gitSignin() {
    this.loginService.gitHubSignIn();
  }

}
