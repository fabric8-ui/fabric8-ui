import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import { DebugElement } from '@angular/core';
import { FormsModule }  from '@angular/forms';
import { By }           from '@angular/platform-browser';

import { TreeModule } from 'angular2-tree-component';
import { TreeListComponent } from './treelist.component';

describe('Treelist component - ', () => {
  let comp: TreeListComponent;
  let fixture: ComponentFixture<TreeListComponent>;
  let el: DebugElement;
  let fakeUserList: any[];
  let fakeWorkItem: any;
  let fakeWorkItems: any[] = [];
  let fakeWorkItemsWithChild: any[] = [];

  let treeListOptions = {
    allowDrag: true
  }

  beforeEach(() => {
    fakeUserList = [
      {
        attributes: {
          fullName: 'WILCT Example User 0',
          imageURL: 'https://avatars.githubusercontent.com/u/2410471?v=3'
        },
        id: 'wilct-user0'
      }, {
        attributes: {
          fullName: 'WILCT Example User 1',
          imageURL: 'https://avatars.githubusercontent.com/u/2410472?v=3'
        },
        id: 'wilct-user1'
      }, {
        attributes: {
          fullName: 'WILCT Example User 2',
          imageURL: 'https://avatars.githubusercontent.com/u/2410473?v=3'
        },
        id: 'wilct-user2'
      }
    ];

    fakeWorkItem = {
      'attributes': {
        'system.created_at': null,
        'system.description': null,
        'system.remote_item_id': null,
        'system.state': 'new',
        'system.title': 'test1',
        'version': 0
      },
      'id': '1',
      'relationships': {
        'assignees': {
          'data': [{
            'id': 'wilct-user2',
            'type': 'identities'
          }]
        },
        'baseType': {
          'data': {
            'id': 'system.userstory',
            'type': 'workitemtypes'
          }
        },
        'creator': {
          'data': {
            'id': 'wilct-user2',
            'type': 'identities'
          }
        },
        'comments': {
          'links': {
            'self': '',
            'related': ''
          }
        }
      },
      'type': 'workitems',
      'relationalData': {
        'creator': fakeUserList[0],
        'assignees': [fakeUserList[2]]
      }
    };

    fakeWorkItems.push(Object.assign({}, fakeWorkItem));
    fakeWorkItemsWithChild.push(Object.assign({}, fakeWorkItem));
    fakeWorkItemsWithChild[0].children = [ Object.assign({}, fakeWorkItem, { id: '2'}) ];
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, TreeModule],
      declarations: [TreeListComponent]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(TreeListComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('Should have at least one node', () => {
    comp.nodes = fakeWorkItems;
    comp.options = treeListOptions;
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('.tree-list'));
    expect(el).toBeDefined();
  });

  it('Should not have toggle to expand tree', () => {
    comp.nodes = fakeWorkItems;
    comp.options = treeListOptions;
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('.tree-list.tree-node-collapsed'));
    expect(el).toBeNull();
  });

  it('Should have toggle to expand tree', () => {
    comp.nodes = fakeWorkItemsWithChild;
    comp.options = treeListOptions;
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('.tree-list.tree-node-collapsed'));
    expect(el).toBeDefined();
  });

  it('Should expand tree node on click', () => {
    comp.nodes = fakeWorkItemsWithChild;
    comp.options = treeListOptions;
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('.tree-list .toggle-children-wrapper-collapsed'));
    expect(el).toBeDefined();

    // Click on the label to open the list
    el.triggerEventHandler('click', {});
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('.tree-list .toggle-children-wrapper-expanded'));
    expect(el).toBeDefined();
  });
});
