import { Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { Space } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { AppState, PlannerState } from './../states/app.state';

@Injectable()
export class SpaceQuery {
    constructor(private store: Store<AppState>) {}

    private plannerSelector = createFeatureSelector<PlannerState>('planner');
    private spaceSelector = createSelector(
        this.plannerSelector,
        // TODO
        // This is a HACK till fabric8-ui removes the unnecessary planner imports
        // it should just be
        // state => state.space
        state => state ? state.space : {} as Space
      );

    get getCurrentSpace(): Observable<Space> {
        return this.store.select(this.spaceSelector);
    }
}
