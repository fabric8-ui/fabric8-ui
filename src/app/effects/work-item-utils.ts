import { Observable } from 'rxjs';
import { WorkItemUI } from '../models/work-item';
import { FilterService } from '../services/filter.service';
import { WorkItemService } from '../services/work-item.service';

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
      return workItemService.getWorkItems2(1, searchPayload)
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
