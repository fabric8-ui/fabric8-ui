import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as GroupTypeActions from './../actions/group-type.actions';
import { Observable } from 'rxjs';
import { GroupTypesService as GTService } from './../services/group-types.service';
import {
  GroupTypeService,
  GroupTypeMapper
} from './../models/group-types.model';

export type Action = GroupTypeActions.All;

@Injectable()
export class GroupTypeEffects {
  constructor(
    private actions$: Actions,
    private groupTypeService: GTService
  ){}

  @Effect() getGroupTypes$: Observable<Action> = this.actions$
    .ofType(GroupTypeActions.GET)
    .switchMap(action => {
      return this.groupTypeService.getFlatGroupList()
        .map((types: GroupTypeService[]) => {
          const gtm = new GroupTypeMapper();
          return new GroupTypeActions.GetSuccess(
            types.map(t => gtm.toUIModel(t))
          )
        })
    })
}
