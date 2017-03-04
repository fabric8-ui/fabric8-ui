import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DebugElement } from '@angular/core';
import { FormsModule }  from '@angular/forms';
import { By }           from '@angular/platform-browser';

import { Logger, Broadcaster } from 'ngx-login-client';

import { WorkItem } from '../../models/work-item';
import { WorkItemService } from '../work-item.service';

import { WorkItemQuickAddComponent } from './work-item-quick-add.component';

describe('Quick add work item component - ', () => {
  let comp: WorkItemQuickAddComponent;
  let fixture: ComponentFixture<WorkItemQuickAddComponent>;
  let el: DebugElement;
  let fakeWorkItem: WorkItem[];
  let fakeService: any;

  let wiTypes = [
      {
         'id' : '86af5178-9b41-469b-9096-57e5155c3f31',
         'attributes' : {
            'name' : 'Planner Item',
            'icon': 'fa-question',
            'fields' : {
               'system.created_at' : {
                  'type' : {
                     'kind' : 'instant'
                  },
                  'required' : false
               },
               'system.remote_item_id' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'string'
                  }
               },
               'system.area' : {
                  'type' : {
                     'kind' : 'area'
                  },
                  'required' : false
               },
               'system.title' : {
                  'required' : true,
                  'type' : {
                     'kind' : 'string'
                  }
               },
               'system.creator' : {
                  'type' : {
                     'kind' : 'user'
                  },
                  'required' : true
               },
               'system.assignees' : {
                  'type' : {
                     'kind' : 'list',
                     'componentType' : 'user'
                  },
                  'required' : false
               },
               'system.state' : {
                  'required' : true,
                  'type' : {
                     'kind' : 'enum',
                     'values' : [
                        'new',
                        'open',
                        'in progress',
                        'resolved',
                        'closed'
                     ],
                     'baseType' : 'string'
                  }
               },
               'system.description' : {
                  'required' : false,
                  'type' : {
                     'kind' : 'markup'
                  }
               },
               'system.iteration' : {
                  'type' : {
                     'kind' : 'iteration'
                  },
                  'required' : false
               }
            },
            'description' : 'Description for Planner Item',
            'version' : 0
         },
         'type' : 'workitemtypes'
      }
  ];

  beforeEach(() => {
    fakeWorkItem = [
      {
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
          'data': []
        },
        'baseType': {
          'data': {
            'id': 'system.userstory',
            'type': 'workitemtypes'
          }
        },
        'creator': {}
      },
      'type': 'workitems'
    }] as WorkItem[];

    fakeService = {
      create: function (workItem: WorkItem) {
        return new Promise((resolve, reject) => {
          resolve(workItem);
          // reject('Title is empty');
        });
      },
      workItemTypes: wiTypes
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        WorkItemQuickAddComponent
      ],
      providers: [
        Broadcaster,
        Logger,
        {
          provide: WorkItemService,
          useValue: fakeService
        }
      ]
    })
      .compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(WorkItemQuickAddComponent);
        comp = fixture.componentInstance;
      });
  }));

  it('Should keep the Add button disabled if title contain only white spaces', () => {
    fixture.detectChanges();
    comp.toggleQuickAdd();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('.workItemQuickAdd_Add'));
    fixture.detectChanges();
    comp.workItem.attributes['system.title'] = '  ';
    fixture.detectChanges();
    expect(el.classes['icon-btn-disabled']).toBeTruthy();
  });

  it('Should keep the Add button disabled if title contain empty string', () => {
    fixture.detectChanges();
    comp.toggleQuickAdd();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('.workItemQuickAdd_Add'));
    fixture.detectChanges();
    comp.workItem.attributes['system.title'] = '';
    fixture.detectChanges();
    expect(el.classes['icon-btn-disabled']).toBeTruthy();
  });

  it('Should raise an error on save if the title contain only white space', fakeAsync(() => {
    el = fixture.debugElement.query(By.css('.pficon-add-circle-o'));
    fixture.detectChanges();
    comp.workItem.attributes['system.title'] = '  ';
    fixture.detectChanges();
    comp.save();
    tick();
    fixture.detectChanges();
    expect(comp.error).not.toBeFalsy();
  }));
});
