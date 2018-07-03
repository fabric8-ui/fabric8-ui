import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import * as LinkTypeActions from './../actions/link-type.actions';

import { Observable } from 'rxjs';
import {
  LinkTypeUI
} from './../models/link-type';
import { SpaceQuery } from './../models/space';
import { WorkItemService } from './../services/work-item.service';

export type Action = LinkTypeActions.All;

@Injectable()
export class LinkTypeEffects {
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private spaceQuery: SpaceQuery
  ) {}

  @Effect() getLinkTypes$: Observable<Action> = this.actions$
    .ofType(LinkTypeActions.GET)
    .withLatestFrom(this.spaceQuery.getCurrentSpace)
    .map(([action, space]) => {
      return {
        payload: action,
        space: space
      };
    })
    .switchMap(lt => {
      return this.workItemService.getAllLinkTypes(lt.space.links.workitemlinktypes)
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
        });
    });
}
