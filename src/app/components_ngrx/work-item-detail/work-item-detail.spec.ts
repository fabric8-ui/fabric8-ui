import { IterationUI } from '../../models/iteration.model';
import { LabelUI } from '../../models/label.model';

import { orderBy } from 'lodash';


describe('Work Item Detail Page', () => {
  let iterations = [{
    id: '',
    name: 'iter-c',
    parentPath: '',
    resolvedParentPath: '',
    userActive: false,
    isActive: false,
    startAt: '',
    endAt: '',
    description: '',
    state: 'new',
    link: '',
    workItemTotalCount: 0,
    workItemClosedCount: 0,
    parentId: 'parent_01',
    hasChildren: false,
    selected: false,
    showChildren: false
  }, {
    id: '',
    name: 'iter-a',
    parentPath: '',
    resolvedParentPath: '',
    userActive: false,
    isActive: false,
    startAt: '',
    endAt: '',
    description: '',
    state: 'new',
    link: '',
    workItemTotalCount: 0,
    workItemClosedCount: 0,
    parentId: 'parent_01',
    hasChildren: false,
    selected: false,
    showChildren: false
  }, {
    id: '',
    name: 'iter-b',
    parentPath: '',
    resolvedParentPath: '',
    userActive: false,
    isActive: false,
    startAt: '',
    endAt: '',
    description: '',
    state: 'new',
    link: '',
    workItemTotalCount: 0,
    workItemClosedCount: 0,
    parentId: 'parent_01',
    hasChildren: false,
    selected: false,
    showChildren: false
  }] as IterationUI[];

  let iterationsSorted = [{
    id: '',
    name: 'iter-a',
    parentPath: '',
    resolvedParentPath: '',
    userActive: false,
    isActive: false,
    startAt: '',
    endAt: '',
    description: '',
    state: 'new',
    link: '',
    workItemTotalCount: 0,
    workItemClosedCount: 0,
    parentId: 'parent_01',
    hasChildren: false,
    selected: false,
    showChildren: false
  }, {
    id: '',
    name: 'iter-b',
    parentPath: '',
    resolvedParentPath: '',
    userActive: false,
    isActive: false,
    startAt: '',
    endAt: '',
    description: '',
    state: 'new',
    link: '',
    workItemTotalCount: 0,
    workItemClosedCount: 0,
    parentId: 'parent_01',
    hasChildren: false,
    selected: false,
    showChildren: false
  }, {
    id: '',
    name: 'iter-c',
    parentPath: '',
    resolvedParentPath: '',
    userActive: false,
    isActive: false,
    startAt: '',
    endAt: '',
    description: '',
    state: 'new',
    link: '',
    workItemTotalCount: 0,
    workItemClosedCount: 0,
    parentId: 'parent_01',
    hasChildren: false,
    selected: false,
    showChildren: false
  }] as IterationUI[];

  let labels = [{
    id: '',
    name: 'label-b',
    backgroundColor: '',
    version: 0,
    borderColor: '',
    textColor: ''
  }, {
    id: '',
    name: 'label-c',
    backgroundColor: '',
    version: 0,
    borderColor: '',
    textColor: ''
  }, {
    id: '',
    name: 'label-a',
    backgroundColor: '',
    version: 0,
    borderColor: '',
    textColor: ''
  }];

  let labelsSorted = [{
    id: '',
    name: 'label-a',
    backgroundColor: '',
    version: 0,
    borderColor: '',
    textColor: ''
  }, {
    id: '',
    name: 'label-b',
    backgroundColor: '',
    version: 0,
    borderColor: '',
    textColor: ''
  }, {
    id: '',
    name: 'label-c',
    backgroundColor: '',
    version: 0,
    borderColor: '',
    textColor: ''
  }];

  it('drop down values should be sorted alphabetically', () => {
    expect(orderBy(iterations, 'name', 'asc')).toEqual(iterationsSorted);
    expect(labels.sort((l1, l2) => l1.name > l2.name ? 1 : 0)).toEqual(labelsSorted);
  });
});
