import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Actions, Effect } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { Observable } from 'rxjs';
import { cleanObject } from '../models/common.model';
import { FilterService } from '../services/filter.service';
import * as BoardUIActions from './../actions/board-ui.actions';
import * as ColumnWorkItemActions from './../actions/column-workitem.action';
import * as WorkItemActions from './../actions/work-item.actions';
import { WorkItem, WorkItemMapper, WorkItemService, WorkItemUI } from './../models/work-item';
import { WorkItemService as WIService } from './../services/work-item.service';
import { AppState } from './../states/app.state';
import * as util from './work-item-utils';


export type Action = WorkItemActions.All | ColumnWorkItemActions.All | BoardUIActions.All;

@Injectable()
export class WorkItemEffects {
  private workItemMapper: WorkItemMapper =
    new WorkItemMapper();

  constructor(
    private actions$: Actions,
    private workItemService: WIService,
    private store: Store<AppState>,
    private notifications: Notifications,
    private router: Router,
    private route: ActivatedRoute,
    private filterService: FilterService
  ) {}

  resolveWorkItems(
    workItems, state,
    matchingQuery: boolean = false,
    ancestors: string[] = []
  ): WorkItemUI[] {
    const hasAncestors = !!ancestors.length;
    return workItems.map((wi: WorkItemService) => {
      const workItemUI = this.workItemMapper.toUIModel(wi);
      workItemUI.bold = matchingQuery;
      if (hasAncestors) {
        workItemUI.treeStatus = ancestors.findIndex(
          a => a === workItemUI.id
        ) > -1 ? 'expanded' : workItemUI.treeStatus;
        if (workItemUI.treeStatus === 'expanded') {
          workItemUI.childrenLoaded = true;
        }
      }
      let wid = this.workItemMapper.toDynamicUIModel(wi, state.workItemTypes.entities[workItemUI.type].dynamicfields);
      return { ...workItemUI, ...wid };
    });
  }

  @Effect() addWorkItems$ = this.actions$
    .ofType<WorkItemActions.Add>(WorkItemActions.ADD)
    .withLatestFrom(this.store.select('planner'))
    .map(([action, state]) => {
      return {
        payload: action.payload,
        state: state
      };
    })
    .switchMap((op): Observable<WorkItemActions.GetChildren | WorkItemActions.AddSuccess | WorkItemActions.AddError> => {
      const payload = op.payload;
      const state = op.state;
      const createID = payload.createId;
      const workItem = payload.workItem;
      const parentId = payload.parentId;
      return this.workItemService.create(workItem)
        .map(item => {
          let itemUI = this.workItemMapper.toUIModel(item);
          let wid = this.workItemMapper.toDynamicUIModel(
            item, state.workItemTypes.entities[itemUI.type].dynamicfields
          );
          itemUI.createId = createID;
          return { ...itemUI, ...wid };
        })
        .switchMap(w => util.workitemMatchesFilter(this.route.snapshot, this.filterService, this.workItemService, w, state.space.id))
        .mergeMap(wItem => {
          // If a child item is created
          if (parentId) {
            wItem.parentID = parentId;

            // TODO : solve the hack :: link the item
            const linkPayload = util.createLinkObject(
              parentId,
              wItem.id,
              '25c326a7-6d03-4f5a-b23b-86a9ee4171e9'
            );

            return this.workItemService.createLink({
              data: linkPayload
            }).map(() => {
              // for a normal (not a child) work item creation
              // Add item success notification
              const parent = state.workItems.entities[parentId];
              if (!parent.childrenLoaded && parent.hasChildren) {
                return new WorkItemActions.GetChildren(parent);
              } else {
                if (payload.openDetailPage) {
                  this.router.navigateByUrl(document.location.pathname + '/detail/' + wItem.number,
                                            {relativeTo: this.route});
                }
                return new WorkItemActions.AddSuccess(wItem);
              }
            });
          } else {
            // for a normal (not a child) work item creation
            // Add item success notification
            if (payload.openDetailPage) {
              this.router.navigateByUrl(document.location.pathname + '/detail/' + wItem.number,
                                        {relativeTo: this.route});
            }
            return Observable.of(new WorkItemActions.AddSuccess(wItem));
          }
        })
        .catch(() => {
          try {
            this.notifications.message({
              message: `Problem adding work item.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem adding work item.');
          }
          return Observable.of(new WorkItemActions.AddError());
        });
      });

  @Effect() getWorkItems$: Observable<Action> = this.actions$
    .ofType<WorkItemActions.Get>(WorkItemActions.GET)
    .withLatestFrom(this.store.select('planner'))
    .map(([action, state]) => {
      return {
        payload: action.payload,
        state: state
      };
    })
    .switchMap(wp => {
      const payload = wp.payload;
      const state = wp.state;
      const spaceQuery = this.filterService.queryBuilder(
        'space', this.filterService.equal_notation, state.space.id
      );
      const finalQuery = this.filterService.queryJoiner(
        payload.filters, this.filterService.and_notation, spaceQuery
      );
      return this.workItemService.getWorkItems2(payload.pageSize, {expression: finalQuery})
        .map((data: any) => {
          let wis = [];
          if (payload.isShowTree) {
            const ancestors = data.ancestorIDs;
            wis = this.resolveWorkItems(data.workItems, state, payload.isShowTree, ancestors);
            const wiIncludes = this.resolveWorkItems(
              data.included, state,
              false, ancestors
            );
            return [...wis, ...wiIncludes];
          } else {
            wis = this.resolveWorkItems(data.workItems, state, payload.isShowTree);
          }
          return [...wis];
        })
        .map((workItems: WorkItemUI[]) => {
          return new WorkItemActions.GetSuccess(
            workItems
          );
        })
        .catch((e) => {
          try {
            this.notifications.message({
              message: `Problem loading workitems.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem loading workitems.');
          }
          return Observable.of(new WorkItemActions.GetError());
        });
    });

    @Effect() getWorkItemChildren$: Observable<Action> = this.actions$
      .ofType<WorkItemActions.GetChildren>(WorkItemActions.GET_CHILDREN)
      .withLatestFrom(this.store.select('planner'))
      .map(([action, state]) => {
        return {
          payload: action.payload,
          state: state
        };
      })
      .switchMap(wp => {
        const parent = wp.payload;
        const state = wp.state;
        return this.workItemService
          .getChildren2(parent.childrenLink)
          .map((data: WorkItemService[]) => {
            const wis = this.resolveWorkItems(
              data, state
            )
            // resolve parent ID
            .map(w => {
              w.parentID = parent.id;
              return w;
            });
            return [...wis];
          })
          .map((workItems: WorkItemUI[]) => {
            return new WorkItemActions.GetChildrenSuccess({
              parent: parent,
              children: workItems
            });
          })
          .catch(() => {
            try {
              this.notifications.message({
                message: `Problem loading children.`,
                type: NotificationType.DANGER
              } as Notification);
            } catch (e) {
              console.log('Problem loading children.');
            }
            return Observable.of(
              new WorkItemActions.GetChildrenError(parent)
            );
          });
      });

    @Effect() updateWorkItem$: Observable<Action> = this.actions$
      .ofType<WorkItemActions.Update>(WorkItemActions.UPDATE)
      .withLatestFrom(this.store.select('planner'))
      .map(([action, state]) => {
        return {
          payload: action.payload,
          state: state
        };
      })
      .switchMap(wp => {
        let payload;
        if (wp.payload.type) {
          // This order must be followed
          // because baseType is needed for dynamic fields
          const dynamicPayload = this.workItemMapper.toDyanmicServiceModel(
            wp.payload,
            wp.state.workItemTypes.entities[wp.payload.type].dynamicfields
          );
          const staticPayload = this.workItemMapper.toServiceModel(wp.payload);

          payload = cleanObject({
            ...staticPayload,
            ...{ attributes: {
                 ...staticPayload.attributes,
                 ...dynamicPayload.attributes
            }}
          });
        } else {
          payload = this.workItemMapper.toServiceModel(wp.payload);
        }
        const state = wp.state;
        return this.workItemService.update(payload)
          .map(w => this.resolveWorkItems([w], state)[0])
          .switchMap(w => util.workitemMatchesFilter(this.route.snapshot, this.filterService, this.workItemService, w, state.space.id))
          .map(w => {
            const item = state.workItems.entities[w.id];
            if (item) {
              w.treeStatus = item.treeStatus;
              w.childrenLoaded = item.childrenLoaded;
              w.parentID = item.parentID;
            }
            return w;
          })
          .map((workItem: WorkItemUI) => {
            return new WorkItemActions.UpdateSuccess(workItem);
          })
          .catch(() => {
            try {
              this.notifications.message({
                message: `Problem in update Workitem.`,
                type: NotificationType.DANGER
              } as Notification);
            } catch (e) {
              console.log('Problem in update Workitem.');
            }
            return Observable.of(
              new WorkItemActions.UpdateError()
            );
          });
      });


    @Effect() Reorder: Observable<Action> = this.actions$
      .ofType<WorkItemActions.Reorder>(WorkItemActions.REORDER)
      .withLatestFrom(this.store.select('planner'))
      .map(([action, state]) => {
        return {
          payload: action.payload,
          state: state
        };
      })
      .switchMap((op) => {
        const workitem = this.workItemMapper.toServiceModel(op.payload.workitem);
        return this.workItemService.reOrderWorkItem(workitem, op.payload.destinationWorkitemID, op.payload.direction)
          .map(w => this.resolveWorkItems([w], op.state)[0])
          .map(w => {
            w.treeStatus = op.payload.workitem.treeStatus;
            w.bold = op.payload.workitem.bold;
            w.childrenLoaded = op.payload.workitem.childrenLoaded;
            w.parentID = op.state.workItems.entities[w.id].parentID;
            return w;
          })
          .map(w => new WorkItemActions.UpdateSuccess(w))
          .catch(e => {
            try {
              this.notifications.message({
                message: `Problem in reorder workitem.`,
                type: NotificationType.DANGER
              } as Notification);
            } catch (e) {
              console.log('Problem in reorder workitem.');
            }
            return Observable.of(new WorkItemActions.UpdateError());
          });
      });

    @Effect() updateWorkItemFromBoard: Observable<Action> = this.actions$
    .ofType<ColumnWorkItemActions.Update>(ColumnWorkItemActions.UPDATE)
    .withLatestFrom(this.store.select('planner'))
    .map(([action, state]) => {
      return {
        payload: action.payload,
        state: state
      };
    })
    .switchMap(wp => {
        const staticPayload = this.workItemMapper.toServiceModel(wp.payload.workItem);
        const payload = cleanObject(staticPayload, ['baseType']);
        return this.workItemService.update(payload)
        .switchMap((workitem) => {
          let reorderPayload = wp.payload.reorder;
          reorderPayload.workitem.version = workitem.attributes['version'];
          const workItem = this.workItemMapper.toServiceModel(reorderPayload.workitem);
          return reorderPayload.direction ?
            this.workItemService.reOrderWorkItem(workItem, reorderPayload.destinationWorkitemID, reorderPayload.direction) :
            Observable.of(workitem);
        })
        .map(w => {
          let wi = this.resolveWorkItems([w], wp.state)[0];
          return wi;

        })
        .switchMap((w: WorkItemUI) => {
          return [
            new WorkItemActions.UpdateSuccess(w),
            new ColumnWorkItemActions.UpdateSuccess({
              workItemId: w.id,
              prevColumnId: wp.payload.prevColumnId,
              newColumnIds: w.columnIds
            }),
            new BoardUIActions.UnlockBoard()
          ];
        })
        .catch((e) => {
          try {
            this.notifications.message({
              message: `Problem loading workitems.`,
              type: NotificationType.DANGER
            } as Notification);
          } catch (e) {
            console.log('Problem loading workitems.');
          }
          return [
            new ColumnWorkItemActions.UpdateError({
              prevColumnId: wp.payload.prevColumnId,
              newColumnIds: wp.payload.workItem.columnIds
            }),
            new BoardUIActions.UnlockBoard()
          ];
        });
    });

    @Effect() getWorkItemChildrenForQuery$: Observable<Action> = this.actions$
      .ofType<WorkItemActions.GetWorkItemChildrenForQuery>(WorkItemActions.GET_WORKITEM_CHILDREN_FOR_Query)
      .withLatestFrom(this.store.select('planner'))
      .map(([action, state]) => {
        return {
          payload: action.payload,
          state: state
        };
      })
      .switchMap(wp => {
        return this.workItemService
          .getChildren2(wp.payload)
          .map((data: WorkItemService[]) => {
            return this.resolveWorkItems(data, wp.state);
          })
          .map((workItems: WorkItemUI[]) => {
            return new WorkItemActions.GetSuccess(
              workItems
            );
          })
          .catch(() => {
            try {
              this.notifications.message({
                message: `Problem loading children.`,
                type: NotificationType.DANGER
              } as Notification);
            } catch (e) {
              console.log('Problem loading children.');
            }
            return Observable.of(
              new WorkItemActions.GetError()
            );
          });
      });
}
