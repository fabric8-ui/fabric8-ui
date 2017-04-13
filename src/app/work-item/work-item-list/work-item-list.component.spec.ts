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

import { TooltipModule } from 'ng2-bootstrap';
import { DragulaModule } from 'ng2-dragula';
import { AlmUserName } from '../../pipes/alm-user-name.pipe';
import { Broadcaster, Logger } from 'ngx-base';
import {
  // AlmUserName,
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';
import {
  AlmIconModule,
  DialogModule,
  InfiniteScrollModule
} from 'ngx-widgets';

import { WorkItemQuickAddModule } from '../work-item-quick-add/work-item-quick-add.module';

import { WorkItem } from '../../models/work-item';
import { WorkItemType } from '../../models/work-item-type';
import { WorkItemService } from '../work-item.service';

import { IterationModel } from '../../models/iteration.model';
import { IterationService } from '../../iteration/iteration.service';

import { WorkItemListEntryComponent } from './work-item-list-entry/work-item-list-entry.component';
import { WorkItemListComponent } from './work-item-list.component';
import { Observable } from 'rxjs';


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
        'area': { },
        'iteration': { },
        'assignees': {
          'data': [
            {
              'attributes': {
                'username': 'username2',
                'fullName': 'WIDCT Example User 2',
                'imageURL': 'https://avatars.githubusercontent.com/u/002?v=3'
            },
            'type': 'identities',
            'id': 'widct-user2'
          }
          ]
        },
        'baseType': {
          'data': {
            'id': 'system.userstory',
            'type': 'workitemtypes'
          }
        },
        'creator': {
          'data': {
            'attributes': {
              'username': 'username0',
              'fullName': 'WIDCT Example User 0',
              'imageURL': 'https://avatars.githubusercontent.com/u/000?v=3'
            },
            'type': 'identities',
            'id': 'widct-user0'
          }
        },
        'comments': {
          'data': [],
          'links': {
            'self': '',
            'related': ''
          }
        }
      },
      'type': 'workitems',
      'links': {
        'self': ''
      },
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
      { attributes: { name: 'system.userstory' } },
      { attributes: { name: 'system.valueproposition' } },
      { attributes: { name: 'system.fundamental' } },
      { attributes: { name: 'system.experience' } },
      { attributes: { name: 'system.feature' } },
      { attributes: { name: 'system.bug' } }
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
        return Observable.of(fakeWorkItem);
      },
      update: function () {
        return Observable.of(fakeWorkItem);
      },
      getWorkItemTypes: function () {
        return Observable.of(fakeWorkItemTypes);
      },

      getStatusOptions: function () {
        return Observable.of(fakeWorkItemStates);
      },

      getWorkItems: function () {
        return Observable.of(fakeWorkItems);
      },

      getLocallySavedWorkItems: function() {
        return Observable.of(fakeWorkItems);
      }
    };

    fakeIterationService = {
      getIterations: function () {
        return Observable.of(fakeIterationList);
      },
      getSpaces: function () {
        let spaces = [{
          'attributes': {
            'name': 'Project 1'
          },
          'type': 'spaces'
        }];
        return spaces;
      },
      isRootIteration: function(iteration: IterationModel): boolean {
        if (iteration.attributes.parent_path==='/')
          return true;
        else
          return false;
      }
    };


    fakeUserService = {
      getUser: function () {
        return Observable.of(fakeUser);
      },

      getAllUsers: function () {
        return Observable.of(fakeUserList);
      },

      getSavedLoggedInUser: function () {
        return fakeUser;
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
        DragulaModule,
        AlmIconModule,
        DialogModule,
        InfiniteScrollModule,
        WorkItemQuickAddModule
      ],

      declarations: [
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
