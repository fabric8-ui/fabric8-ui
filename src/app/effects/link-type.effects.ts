import { Actions, Effect } from '@ngrx/effects';
import { Injectable } from '@angular/core';
import * as LinkTypeActions from './../actions/link-type.actions';

import { Observable } from 'rxjs';
import { WorkItemService } from './../services/work-item.service';
import {
  LinkTypeService,
  LinkTypeUI
} from './../models/link-type';

export type Action = LinkTypeActions.All;

@Injectable()
export class LinkTypeEffects {
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService
  ){}

  @Effect() getLinkTypes$: Observable<Action> = this.actions$
    .ofType(LinkTypeActions.GET)
    .switchMap(action => {
      return this.workItemService.getAllLinkTypes()
        .map((data) => {
          let lts: any = {};
          let linkTypes: LinkTypeUI[] = [];
          lts['forwardLinks'] = data.json().data;
          lts['backwardLinks'] = data.json().data;
          lts.forwardLinks.forEach((linkType) => {
            linkTypes.push({
              name: linkType.attributes['forward_name'],
              id: linkType.id,
              linkType: 'forward'
            });
          });
          lts.backwardLinks.forEach((linkType) => {
            linkTypes.push({
              name: linkType.attributes['reverse_name'],
              id: linkType.id,
              linkType: 'reverse'
            });
          });
          return new LinkTypeActions.GetSuccess(linkTypes);
        })
    })
}
