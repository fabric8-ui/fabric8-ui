import { Component, OnInit } from '@angular/core';

import { AuthenticationService } from './../auth/authentication.service';
import { Broadcaster } from './../shared/broadcaster.service';

@Component({
  selector: 'fab-planner-iteration',
  templateUrl: './iteration.component.html',
  styleUrls: ['./iteration.component.scss']
})
export class IterationComponent implements OnInit {

  authUser: any = null;
  loggedIn: Boolean = false;
  isCollapsedCurrentIteration: Boolean = false;
  isCollapsedFutureIteration: Boolean = true;
  isCollapsedPastIteration: Boolean = true;
  barchatValue: number = 70;

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster
  ) {}

  ngOnInit(): void {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
  }

  listenToEvents() {
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.loggedIn = false;
        this.authUser = null;
    });
  }
 }
