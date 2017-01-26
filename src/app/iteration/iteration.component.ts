import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Params, ActivatedRoute } from '@angular/router';
import { SpaceService, Space } from './../shared/mock-spaces.service';
import { IterationService } from './iteration.service';
import { IterationModel } from './../models/iteration.model';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { AuthenticationService } from './../auth/authentication.service';
import { Broadcaster } from './../shared/broadcaster.service';

@Component({
  selector: 'fab-planner-iteration',
  templateUrl: './iteration.component.html',
  styleUrls: ['./iteration.component.scss']
})
export class IterationComponent implements OnInit, OnDestroy {

  authUser: any = null;
  loggedIn: Boolean = false;
  isCollapsedCurrentIteration: Boolean = false;
  isCollapsedFutureIteration: Boolean = true;
  isCollapsedPastIteration: Boolean = true;
  barchatValue: number = 70;
  allIterations: IterationModel[] = [];
  futureIterations: IterationModel[] = [];
  currentIterations: IterationModel[] = [];
  closedIterations: IterationModel[] = [];

  private spaceSubscription: Subscription = null;

  constructor(
    private auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private iterationService: IterationService,
    private spaceService: SpaceService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.listenToEvents();
    this.loggedIn = this.auth.isLoggedIn();
    this.getAndfilterIterations();
    this.spaceSubscription = this.spaceService.getCurrentSpaceBus().subscribe(space => console.log('[IterationComponent] New Space selected: ' + space.name));
  }

  ngOnDestroy() {
    // prevent memory leak when component is destroyed
    this.spaceSubscription.unsubscribe();
  }

  getAndfilterIterations() {
    // Fetching space data
    // This is temporary
    this.spaceService.getCurrentSpace()
      .then((data) => {
        this.iterationService.getIterations(data.iterationsUrl)
        .then((iterations) => {
          this.futureIterations = iterations.filter((iteration) => iteration.attributes.state === 'new');
          this.currentIterations = iterations.filter((iteration) => iteration.attributes.state === 'start');
          this.closedIterations = iterations.filter((iteration) => iteration.attributes.state === 'close');
        })
        .catch ((e) => {
          console.log('Some error has occured', e);
        });
      })
      .catch ((err: any) => {
        console.log('Space not found');
      });
  }

  clusterIterations() {
    this.futureIterations = this.allIterations.filter((iteration) => iteration.attributes.state === 'new');
    this.currentIterations = this.allIterations.filter((iteration) => iteration.attributes.state === 'start');
    this.closedIterations = this.allIterations.filter((iteration) => iteration.attributes.state === 'close');
  }

  onCreateOrupdateIteration(iteration: IterationModel) {
    let index = this.allIterations.findIndex((it) => it.id === iteration.id);
    if (index >= 0) {
      this.allIterations[index] = iteration;
    } else {
      this.allIterations.splice(this.allIterations.length, 0, iteration);
    }
    this.clusterIterations();
  }

  listenToEvents() {
    this.broadcaster.on<string>('logout')
      .subscribe(message => {
        this.loggedIn = false;
        this.authUser = null;
    });
  }
 }
