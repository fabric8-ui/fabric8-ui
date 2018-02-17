import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from './../states/app.state';
import { Injectable } from '@angular/core';
import * as WorkItemTypeActions from './../actions/work-item-type.actions';
import * as WIStateActoins from './../actions/work-item-state.actions';
import { Observable } from 'rxjs';
import { WorkItemService } from './../services/work-item.service';
import {
  WorkItemTypeService,
  WorkItemTypeMapper,
  WorkItemTypeResolver
} from './../models/work-item-type';

export type Action = WorkItemTypeActions.All;

@Injectable()
export class WorkItemTypeEffects {
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private store: Store<AppState>
  ) {}

  @Effect() getWorkItemTypes$: Observable<Action> = this.actions$
    .ofType(WorkItemTypeActions.GET)
    .switchMap(action => {
      return this.workItemService.getWorkItemTypes()
        .map((types: WorkItemTypeService[]) => {
          const witm = new WorkItemTypeMapper();
          const wiTypes = types.map(t => witm.toUIModel(t));
          const witResolver = new WorkItemTypeResolver(wiTypes);
          witResolver.resolveChildren();
          console.log('##### - 1', witResolver.getResolvedWorkItemTypes());
          this.store.dispatch(new WIStateActoins.GetSuccess(types));
          return new WorkItemTypeActions.GetSuccess(
            witResolver.getResolvedWorkItemTypes()
          );
        })
    })
}
