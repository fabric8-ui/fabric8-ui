import { GET_SUCCESS, GetSuccess } from '../actions/work-item.actions';
import { WorkItemUI } from '../models/work-item';
import { ColumnWorkItemState, InitialColumnWorkItemState  } from '../states/index.state';
import { GetError } from './../actions/board.actions';
import { ColumnWorkItemReducer } from './column-workitem.reducer';


describe('ColumnWorkitemReducer: ', () => {
  it('should update column-workitem state on [workitem] Get Success', () => {
    const workitems: WorkItemUI[] = [
      {
        id: '1',
        title: 'Work Item 2',
        number: '2',
        columnIds: [ '0000-000-05', '0000-000-06']
      },
      {
        id: '2',
        title: 'Work Item 1',
        number: '1',
        columnIds: ['0000-000-05', '0000-000-07']
      },
      {
        id: '3',
        title: 'Work Item 1',
        number: '3',
        columnIds: null
      }
    ] as WorkItemUI[];

    const columWorkItemState: ColumnWorkItemState = {
      '0000-000-05': ['1', '2'],
      '0000-000-06': ['1'],
      '0000-000-07': ['2']
    };

    const action = new GetSuccess(workitems);
    const state = ColumnWorkItemReducer(InitialColumnWorkItemState, action);

    expect(state).toEqual(columWorkItemState);
  });

  it('should not update the state when there are no columnIds', () => {
    const workitems: WorkItemUI[] = [
      {
        id: '1',
        title: 'Work Item 1',
        number: '1',
        columnIds: null
      }
    ] as WorkItemUI[];

    const action = new GetSuccess(workitems);
    const state = ColumnWorkItemReducer(InitialColumnWorkItemState, action);

    expect(state).toEqual(InitialColumnWorkItemState);

  });

  it('should return the state when some other action is dispatched', () => {
    const action = new GetError();
    const state = ColumnWorkItemReducer(InitialColumnWorkItemState, action);
    expect(state).toEqual(InitialColumnWorkItemState);
  });
});
