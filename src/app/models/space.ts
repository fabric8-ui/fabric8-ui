import { Injectable } from '@angular/core';
import { createFeatureSelector, createSelector, Store } from '@ngrx/store';
import { Space } from 'ngx-fabric8-wit';
import { Observable } from 'rxjs';
import { AppState, PlannerState } from './../states/app.state';

export const  plannerSelector = createFeatureSelector<PlannerState>('planner');
export const spaceSelector = createSelector(
    plannerSelector,
    // TODO
    // This is a HACK till fabric8-ui removes the unnecessary planner imports
    // it should just be
    // state => state.space
    state => state ? state.space : {} as Space
);
@Injectable()
export class SpaceQuery {
    constructor(private store: Store<AppState>) {}

    get getCurrentSpace(): Observable<Space> {
        return this.store.select(spaceSelector);
    }
}
