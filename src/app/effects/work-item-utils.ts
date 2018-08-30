import { Injectable } from '@angular/core';
import { ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Notification, Notifications, NotificationType } from 'ngx-base';
import { Observable, pipe } from 'rxjs';
import { catchError, withLatestFrom } from 'rxjs/operators';
import { WorkItemUI } from '../models/work-item';
import { FilterService } from '../services/filter.service';
import { WorkItemService } from '../services/work-item.service';


export const filterTypeWithSpace = (x, y) => pipe(
  ofType(x),
  withLatestFrom(y));

@Injectable()
export class ErrorHandler {
  constructor(private notifications: Notifications) {}

  public handleError<T>(error: any, msg: string, nextActions: T | T[]): T[] {
    this.notifyError(msg);
    return Array.isArray(nextActions) ? nextActions : [nextActions];
  }

  private notifyError(msg: string): void {
    try {
      this.notifications.message({
        message: msg,
        type: NotificationType.DANGER
      } as Notification);
    } catch (e) {
      console.log('Problem in fetching Areas.');
    }
  }

}

export function workitemMatchesFilter(route,
  filterService: FilterService,
  workItemService: WorkItemService,
  workitem: WorkItemUI,
  spaceId: string): Observable<WorkItemUI> {
    const currentRoute = route.queryParams;
    if ((currentRoute['q']
        && currentRoute.hasOwnProperty('q')
        && currentRoute['q'].includes('boardContextId')) ||
        (document.location.pathname.indexOf('/query') > -1)
      ) {
        return Observable.of(workitem);
    }
    if (Object.keys(currentRoute).length === 0 && currentRoute.constructor === Object) {
      return Observable.of(workitem);
    } else {
      const wiQuery = filterService.queryBuilder(
        'number', filterService.equal_notation, workitem.number.toString()
      );
      const exp = filterService.queryJoiner(
        filterService.queryToJson(currentRoute['q']),
        filterService.and_notation,
        wiQuery
      );
      const spaceQuery = filterService.queryBuilder(
        'space', filterService.equal_notation, spaceId
      );
      const finalQuery = filterService.queryJoiner(
        exp, filterService.and_notation, spaceQuery
      );
      const searchPayload = {
        expression: finalQuery
      };
      return workItemService.getWorkItems(1, searchPayload)
        .map(data => data.totalCount)
        .map(count => {
          workitem.bold = count > 0;
          return workitem;
        });
    }
}

export function createLinkObject(parentWorkItemId: string, childWorkItemId: string, linkId: string) {
  return {
    'type': 'workitemlinks',
    'attributes': {
      'version': 0
    },
    'relationships': {
      'link_type': {
        'data': {
          'id': linkId,
          'type': 'workitemlinktypes'
        }
      },
      'source': {
        'data': {
          'id': parentWorkItemId,
          'type': 'workitems'
        }
      },
      'target': {
        'data': {
          'id': childWorkItemId,
          'type': 'workitems'
        }
      }
    }
  };
}
