import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

import { DndModule } from 'ng2-dnd';
import { TooltipModule } from 'ng2-bootstrap/components/tooltip';
import { AlmUserName } from '../../pipes/alm-user-name.pipe';
import {
  // AlmUserName,
  AuthenticationService,
  Broadcaster,
  Logger,
  User,
  UserService
} from 'ngx-login-client';
import {
  AlmArrayFilter,
  AlmIconModule,
  DialogModule,
  InfiniteScrollModule
} from 'ngx-widgets';

import { WorkItemQuickAddModule } from '../work-item-quick-add/work-item-quick-add.module';

import { WorkItem } from '../../models/work-item';
import { WorkItemType } from '../work-item-type';
import { WorkItemService } from '../work-item.service';

import { IterationModel } from '../../models/iteration.model';
import { IterationService } from '../../iteration/iteration.service';

import { WorkItemListEntryComponent } from './work-item-list-entry/work-item-list-entry.component';
import { WorkItemListComponent } from './work-item-list.component';


describe('Work item list view - ', () => {
  let comp: WorkItemListComponent;
  let fixture: ComponentFixture<WorkItemListComponent>;
  let el: DebugElement;
  let el1: DebugElement;
  let logger: Logger;
  let fakeWorkItem: WorkItem;
  let fakeWorkItems: WorkItem[] = [];
  let fakeIteration: IterationModel;
  let fakeIterationList: IterationModel[] = [];
  let fakeIterationService: any;
  let fakeUser: User;
  let fakeUserList: User[];
  let fakeWorkItemService: any;
  let fakeAuthService: any;
  let fakeUserService: any;
  let fakeWorkItemTypes: WorkItemType[];
  let fakeWorkItemStates: Object[];

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
    ] as User[];

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
    } as WorkItem;

    fakeWorkItems.push(fakeWorkItem);

    fakeWorkItemStates = [
      { option: 'new' },
      { option: 'open' },
      { option: 'in progress' },
      { option: 'resolved' },
      { option: 'closed' }
    ];

    fakeIteration = {
      'attributes': {
        'name': 'Iteration 1'
      },
      'type': 'iterations'

    } as IterationModel;

    fakeIterationList.push(fakeIteration);

    fakeUser = {
      attributes: {
        fullName: 'WILCT Example User 2',
        imageURL: 'https://avatars.githubusercontent.com/u/2410473?v=3'
      },
      id: 'wilct-user2'
    } as User;

    fakeWorkItemTypes = [
      { name: 'system.userstory' },
      { name: 'system.valueproposition' },
      { name: 'system.fundamental' },
      { name: 'system.experience' },
      { name: 'system.feature' },
      { name: 'system.bug' }
    ] as WorkItemType[];


    fakeAuthService = {
      loggedIn: false,

      getToken: function () {
        return '';
      },
      isLoggedIn: function () {
        return this.loggedIn;
      },
      login: function () {
        this.loggedIn = true;
      },

      logout: function () {
        this.loggedIn = false;
      }
    };

    fakeWorkItemService = {
      create: function () {
        return new Promise((resolve, reject) => {
          resolve(fakeWorkItem);
        });
      },
      update: function () {
        return new Promise((resolve, reject) => {
          resolve(fakeWorkItem);
        });
      },
      getWorkItemTypes: function () {
        return new Promise((resolve, reject) => {
          resolve(fakeWorkItemTypes);
        });
      },

      getStatusOptions: function () {
        return new Promise((resolve, reject) => {
          resolve(fakeWorkItemStates);
        });
      },

      getWorkItems: function () {
        return new Promise((resolve, reject) => {
          resolve(fakeWorkItems);
        });
      },

      getLocallySavedWorkItems: function() {
        return new Promise((resolve, reject) => {
          resolve(fakeWorkItems);
        });
      }
    };

    fakeIterationService = {
      getIterations: function () {
        return new Promise((resolve, reject) => {
          resolve(fakeIterationList);
        });
      },
      getSpaces: function () {
        let spaces = [{
          'attributes': {
            'name': 'Project 1'
          },
          'type': 'spaces'
        }];
        return spaces;
      }
    };


    fakeUserService = {
      getUser: function () {
        return new Promise((resolve, reject) => {
          resolve(fakeUser);
        });
      },

      getAllUsers: function () {
        return new Promise((resolve, reject) => {
          resolve(fakeUserList);
        });
      }
    };

  });



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule,
        CommonModule,
        TooltipModule,
        DndModule.forRoot(),
        AlmIconModule,
        DialogModule,
        InfiniteScrollModule,
        WorkItemQuickAddModule
      ],

      declarations: [
        AlmArrayFilter,
        WorkItemListEntryComponent,
        WorkItemListComponent
      ],
      providers: [
        Broadcaster,
        Logger,

        Location,
        {
          provide: AuthenticationService,
          useValue: fakeAuthService
        },
        {
          provide: IterationService,
          useValue: fakeIterationService
        },
        {
          provide: UserService,
          useValue: fakeUserService
        },
        {
          provide: WorkItemService,
          useValue: fakeWorkItemService
        }
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(WorkItemListComponent);
        comp = fixture.componentInstance;

      });
  }));

  // Crrating new item is moved to parent component

  // it('have a button for adding a new work item', () => {
  //   fakeAuthService.login();
  //   fixture.detectChanges();
  //   el = fixture.debugElement.query(By.css('.add-detailed-wi'));
  //   expect(el).toBeDefined();
  // });

  // it('clicking show types should display the list of types', () => {
  //   fakeAuthService.login();
  //   fixture.detectChanges();
  //   comp.showTypes();
  //   el = fixture.debugElement.query(By.css('.types-modal'));
  //   expect(el).toBeDefined();
  // });

});
