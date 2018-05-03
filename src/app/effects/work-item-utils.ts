import { Observable } from 'rxjs';
import { WorkItemUI } from '../models/work-item';

export function workitemMatchesFilter(route, filterService, workItemService, workitem): Observable<WorkItemUI> {
    
    const currentRoute = route.queryParams;
    const wiQuery = filterService.queryBuilder(
      'number', filterService.equal_notation, workitem.number.toString()
    );
    const exp = filterService.queryJoiner(
      filterService.queryToJson(currentRoute['q']),
      filterService.and_notation,
      wiQuery
    );
    const searchPayload = {
      expression: exp
    };
    return workItemService.getWorkItems2(1, searchPayload)
      .map(data => data.totalCount)
      .map(count => {
        workitem.bold = count > 0;
        return workitem;
      });
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