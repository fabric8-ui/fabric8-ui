import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as WorkItemTypeActions from './../actions/work-item-type.actions';
import { Observable } from 'rxjs';
import { WorkItemService } from './../services/work-item.service';
import {
  WorkItemTypeService,
  WorkItemTypeMapper
} from './../models/work-item-type';

export type Action = WorkItemTypeActions.All;

@Injectable()
export class WorkItemTypeEffects {
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService
  ) {}

  @Effect() getWorkItemTypes$: Observable<Action> = this.actions$
    .ofType(WorkItemTypeActions.GET)
    .switchMap(action => {
      return this.workItemService.getWorkItemTypes()
        .map((types: WorkItemTypeService[]) => {
          const witm = new WorkItemTypeMapper();
          return new WorkItemTypeActions.GetSuccess(
            types.map(t => witm.toUIModel(t))
          )
        })
    })
}
