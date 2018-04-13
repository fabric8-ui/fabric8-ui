import { cloneDeep } from 'lodash';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Params, ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, OnChanges, OnDestroy } from '@angular/core';

import { AuthenticationService } from 'ngx-login-client';
import { Space, Spaces } from 'ngx-fabric8-wit';

import { CustomQueryModel } from '../../models/custom-query.model';
import { FilterService } from '../../services/filter.service';

// ngrx stuff
import { Store } from '@ngrx/store';
import { AppState } from './../../states/app.state';
import * as CustomQueryActions from './../../actions/custom-query.actions';

@Component({
  selector: 'custom-query',
  templateUrl: './custom-query-panel.component.html',
  styleUrls: ['./custom-query-panel.component.less']
})
export class CustomQueryComponent implements OnInit, OnDestroy {

  @Input() sidePanelOpen: boolean = true;

  authUser: any = null;
  private spaceId;
  private eventListeners: any[] = [];
  private customQueries: CustomQueryModel[] = [];
  private startedCheckingURL: boolean = false;

  constructor(
    private auth: AuthenticationService,
    private filterService: FilterService,
    private route: ActivatedRoute,
    private spaces: Spaces,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    const customQueriesData = this.store
      .select('listPage')
      .select('customQueries')

    this.eventListeners.push(
      customQueriesData
      .subscribe((customQueries) => {
        console.log('####-1', customQueries);
        this.customQueries = customQueries;
        if (!this.startedCheckingURL && !!this.customQueries.length) {
          this.checkURL();
        }
      })
    );
  }

  ngOnDestroy() {
    this.eventListeners.forEach(e => e.unsubscribe());
  }

  constructUrl(attributes) {
    let jsonAttributes = JSON.parse(attributes);
    let jsonQuery = this.filterService.jsonToQuery(jsonAttributes);
    return jsonQuery;
  }

  checkURL() {
    this.startedCheckingURL = true;
    this.eventListeners.push(
      this.route.queryParams.subscribe(val => {
        if (val.hasOwnProperty('q')) {
          const urlQuery = val['q'];
          let foundMatch = false;
          this.customQueries.forEach(q => {
            if (this.constructUrl(q.attributes.fields) === urlQuery) {
              foundMatch = true;
              this.store.dispatch(new CustomQueryActions.Select(q));
            }
          });
          if (!foundMatch) {
            this.store.dispatch(new CustomQueryActions.SelectNone());
          }
        }
      })
    );
  }

}
