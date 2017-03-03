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

import { Logger } from 'ngx-login-client';

import { WorkItem } from '../../models/work-item';
import { WorkItemService } from '../work-item.service';
import { AstronautService } from './../../shared/astronaut.service';

import { WorkItemQuickAddComponent } from './work-item-quick-add.component';

describe('Quick add work item component - ', () => {
  let comp: WorkItemQuickAddComponent;
  let fixture: ComponentFixture<WorkItemQuickAddComponent>;
  let el: DebugElement;
  let fakeWorkItem: WorkItem[];
  let fakeService: any;
  let fakeSpcaeService: any;

  let spaces = [{
        'name': 'Project 1',
        'path': '',
        'description': '',
        'teams': [
            {
              'name': 'Team Project 1',
              'members': [
                  {
                    'attributes': {
                        'fullName': 'Example User 0',
                        'imageURL': 'https://avatars.githubusercontent.com/u/2410471?v=3'
                    },
                    'id': 'user0',
                    'type': 'identities'
                  }
              ]
            }
        ],
        'defaultTeam': {
            'name': 'Team Project 1',
            'members': [
              {
                  'attributes': {
                    'fullName': 'Example User 0',
                    'imageURL': 'https://avatars.githubusercontent.com/u/2410471?v=3'
                  },
                  'id': 'user0',
                  'type': 'identities'
              }
            ]
        },
        'process': {

        },
        'privateSpace': false,
        'id': '1f669678-ca2c-4cbb-b46d-5b70a98dde3c',
        'attributes': {

        },
        'type': 'spaces',
        'links': {
          'self': 'http://localhost:8080/api/'
        },
        'relationships': {
          'areas': {
            'links': {
              'related': 'http://localhost:8080/api/spaces/1f669678-ca2c-4cbb-b46d-5b70a98dde3c/areas'
            }
          },
          'iterations': {
            'links': {
              'related': 'http://localhost:8080/api/spaces/1f669678-ca2c-4cbb-b46d-5b70a98dde3c/iterations'
            }
          }
        }
      }];

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
      }
    };

    fakeSpcaeService = {
      getCurrentSpaceBus: function() {
        let currentSpaceSubjectSource = new BehaviorSubject<any>(spaces[0]);
        return currentSpaceSubjectSource.asObservable();
      },

      getCurrentSpace: function() {
        return Promise.resolve(spaces[0]);
      }
    };
  });

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [
        WorkItemQuickAddComponent
      ],
      providers: [
        Logger,
        {
          provide: WorkItemService,
          useValue: fakeService
        },
        {
          provide: AstronautService,
          useValue: fakeSpcaeService
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
