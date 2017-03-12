import { Component, OnInit } from '@angular/core';

import { Spaces } from 'ngx-fabric8-wit';
import { UserService, User } from 'ngx-login-client';

import { DummyService } from './../shared/dummy.service';

@Component({
  host: {
    'class': "app-component flex-container in-column-direction flex-grow-1"
  },
  selector: 'alm-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loggedInUser: User;

  constructor(
    public dummy: DummyService,
    userService: UserService,
    public spaces: Spaces
  ) {
    userService.loggedInUser.subscribe(val => this.loggedInUser = val);
  }

  ngOnInit() { }

}
