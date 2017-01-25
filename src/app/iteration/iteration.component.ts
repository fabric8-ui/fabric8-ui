import { Params, ActivatedRoute } from '@angular/router';
import { IterationService } from './iteration.service';
import { IterationModel } from './../models/iteration.model';
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
  futureIterations: IterationModel[] = [];
  currentIterations: IterationModel[] = [];
  closedIterations: IterationModel[] = [];

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private iterationService: IterationService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
    this.getAndfilterIterations();
  }

  getAndfilterIterations() {
    // Fetching space data
    // This is temporary
    this.iterationService.getSpaces()
    .then((data) => {
      this.iterationService.getIterations(data.relationships.iterations.links.related)
      .then((iterations) => {
        this.futureIterations = iterations.filter((iteration) => iteration.attributes.state === 'new');
        this.currentIterations = iterations.filter((iteration) => iteration.attributes.state === 'start');
        this.closedIterations = iterations.filter((iteration) => iteration.attributes.state === 'close');
      })
      .catch ((e) => {
        console.log('Some error has occured', e);
      })
    })
    .catch ((err) => {
      console.log('Spcae not found');
    });
  }

  onCreateNewIteration(iteration: IterationModel) {
    this.futureIterations.splice(
      this.futureIterations.length, 0, iteration
    );
  }

  listenToEvents() {
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.loggedIn = false;
        this.authUser = null;
    });
  }
 }
