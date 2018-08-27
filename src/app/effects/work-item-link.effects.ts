import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  Notification,
  Notifications,
  NotificationType
} from 'ngx-base';
import { Observable } from 'rxjs';
import { SpaceQuery } from '../models/space';
import * as WorkItemLinkActions from './../actions/work-item-link.actions';
import * as WorkItemActions from './../actions/work-item.actions';
import { WorkItemLinkMapper } from './../models/link';
import { WorkItemQuery } from './../models/work-item';
import { WorkItemService } from './../services/work-item.service';
import { AppState } from './../states/app.state';

export type Action = WorkItemLinkActions.All;

@Injectable()
export class WorkItemLinkEffects {
  private wilMapper = new WorkItemLinkMapper();
  constructor(
    private actions$: Actions,
    private workItemService: WorkItemService,
    private workItemQuery: WorkItemQuery,
    private spaceQuery: SpaceQuery,
    private notifications: Notifications,
    private store: Store<AppState>
  ) {}

  @Effect() getLinks$: Observable<Action> = this.actions$
    .ofType<WorkItemLinkActions.Get>(WorkItemLinkActions.GET)
    .map(action => action.payload)
    .switchMap(payload => {
      return this.workItemService.resolveLinks(payload)
        .map(([links, includes]) => {
          return links.map(link => {
            link.relationships.link_type.data = includes.find(i => i.id === link.relationships.link_type.data.id);
            link.relationships.source.data = includes.find(i => i.id === link.relationships.source.data.id);
            link.relationships.target.data = includes.find(i => i.id === link.relationships.target.data.id);
            return link;
          });
        }).map(links => {
          return new WorkItemLinkActions.GetSuccess(
            links.map(l => this.wilMapper.toUIModel(l))
          );
        })
        .catch((e) => {
          try {
            this.notifications.message({
              message: `Problem in fetching links.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem in fetching links');
          }
          return Observable.of(new WorkItemLinkActions.GetError());
        });
    });

  @Effect() createLink$: Observable<Action> = this.actions$
    .ofType<WorkItemLinkActions.Add>(WorkItemLinkActions.ADD)
    .withLatestFrom(this.workItemQuery.getWorkItemEntities)
    .withLatestFrom(this.spaceQuery.getCurrentSpace)
    .map(([[action, workItems], space]) => {
      return {
        payload: action.payload,
        workItems: workItems,
        space: space
      };
    })
    .switchMap(p => {
      let createLinkPayload = {'data': p.payload};
      return this.workItemService
        .createLink(
          p.space.links.self.split('space')[0] + 'workitemlinks',
          createLinkPayload
        )
        .map(([link, includes]) => {
          link.relationships.link_type.data = includes.find(i => i.id === link.relationships.link_type.data.id);
          link.relationships.source.data = includes.find(i => i.id === link.relationships.source.data.id);
          link.relationships.target.data = includes.find(i => i.id === link.relationships.target.data.id);
          let sourceWorkItem;
          let targetWorkItem;
          // the tree will updated
          // only if it is parent-child relationship
          if (link.relationships['link_type'].data.id === '25c326a7-6d03-4f5a-b23b-86a9ee4171e9') {
            if (p.workItems[p.payload.relationships.source.data.id]) {
              sourceWorkItem = p.workItems[p.payload.relationships.source.data.id];
            }
            if (p.workItems[p.payload.relationships.target.data.id]) {
              targetWorkItem = p.workItems[p.payload.relationships.target.data.id];
            }
            if (p.workItems[p.payload.relationships.source.data.id] &&
              p.workItems[p.payload.relationships.target.data.id]) {
              if (sourceWorkItem.treeStatus === 'expanded' ||
              sourceWorkItem.childrenLoaded) {
                this.store.dispatch(new WorkItemActions.CreateLink({
                  source: sourceWorkItem,
                  target: targetWorkItem,
                  sourceTreeStatus: sourceWorkItem.treeStatus
                }));
              } else {
                this.store.dispatch(new WorkItemActions.CreateLink({
                  source: sourceWorkItem,
                  target: targetWorkItem,
                  sourceTreeStatus: sourceWorkItem.treeStatus
                }));
              }
            }
          }
          const linkUIValue = {
            ...this.wilMapper.toUIModel(link),
            ...{ newlyAdded: true }
          };

          return new WorkItemLinkActions.AddSuccess(linkUIValue);
        })
        .catch((e) => {
          try {
            this.notifications.message({
              message: `Problem in creating link`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem in creating link');
          }
          return Observable.of(new WorkItemLinkActions.AddError());
        });
    });

  @Effect() deleteLink$: Observable<Action> = this.actions$
    .ofType<WorkItemLinkActions.Delete>(WorkItemLinkActions.DELETE)
    .withLatestFrom(this.workItemQuery.getWorkItemEntities)
    .withLatestFrom(this.spaceQuery.getCurrentSpace)
    .map(([[action, workItems], space]) => {
      return {
        payload: action.payload,
        workItems: workItems,
        space: space
      };
    })
    .switchMap(p => {
      let wiLink = this.wilMapper.toServiceModel(p.payload.wiLink);
      return this.workItemService
        .deleteLink(
          `${p.space.links.self.split('space')[0]}workitemlinks/${wiLink.id}`)
        .map(response => {
          let targetWorkItem;
          let sourceWorkItem;
          if (p.workItems[p.payload.wiLink.target.id]) {
            targetWorkItem = p.workItems[p.payload.wiLink.target.id];
          }
          if (p.workItems[p.payload.wiLink.source.id]) {
            sourceWorkItem = p.workItems[p.payload.wiLink.source.id];
          }
          this.store.dispatch(new WorkItemActions.DeleteLink({
            source: sourceWorkItem,
            target: targetWorkItem,
            sourceTreeStatus: ''
          }));
          return new WorkItemLinkActions.DeleteSuccess(p.payload.wiLink);
        })
        .catch((e) => {
          try {
            this.notifications.message({
              message: `Problem in deleting work item.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem in deleting work item');
          }
          return Observable.of(new WorkItemLinkActions.DeleteError());
        });
    });
}
