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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { MyDatePickerModule } from 'mydatepicker';

import { Ng2CompleterModule } from 'ng2-completer';
import {
  ComponentLoaderFactory,
  DropdownConfig,
  DropdownModule,
  PositioningService,
  TooltipConfig,
  TooltipModule
} from 'ng2-bootstrap';
import { AlmUserName } from '../../pipes/alm-user-name.pipe';
import { Broadcaster, Logger } from 'ngx-base';
import { Spaces } from 'ngx-fabric8-wit';
import {
  // AlmUserName,
  AuthenticationService,
  User,
  UserService
} from 'ngx-login-client';
import {
  AlmAvatarSize,
  AlmLinkTarget,
  AlmMomentTime,
  AlmSearchHighlight,
  AlmTrim,
  AlmEditableModule,
  AlmIconModule
} from 'ngx-widgets';

import { ModalModule } from 'ngx-modal';
import { SpacesService } from '../../shared/standalone/spaces.service';

import { AreaModel } from '../../models/area.model';
import { AreaService } from '../../area/area.service';
import { DynamicFieldComponent } from './dynamic-form/dynamic-field.component';
import { TypeaheadDropdown } from './typeahead-dropdown/typeahead-dropdown.component';
import { IterationModel } from '../../models/iteration.model';
import { IterationService } from '../../iteration/iteration.service';
import { LinkType } from '../../models/link-type';
import { MarkdownControlComponent } from './markdown-control/markdown-control.component';
import { WorkItem } from '../../models/work-item';
import { WorkItemType } from '../../models/work-item-type';
import { WorkItemService } from '../work-item.service';
import { WorkItemTypeControlService } from './../work-item-type-control.service';

import { WorkItemLinkComponent } from './work-item-link/work-item-link.component';
import { WorkItemCommentComponent } from './work-item-comment/work-item-comment.component';
import { WorkItemDetailComponent } from './work-item-detail.component';
import { WorkItemLinkTypeFilterByTypeName, WorkItemLinkFilterByTypeName } from './work-item-detail-pipes/work-item-link-filters.pipe';
import { CollapseModule } from 'ng2-bootstrap';
import {Observable} from 'rxjs';

describe('Detailed view and edit a selected work item - ', () => {
  let comp: WorkItemDetailComponent;
  let fixture: ComponentFixture<WorkItemDetailComponent>;
  let currentUser: User;
  let el: DebugElement;
  let el1: DebugElement;
  let logger: Logger;
  let fakeWorkItem: WorkItem;
  let fakeWorkItems: WorkItem[] = [];
  let fakeArea: AreaModel;
  let fakeAreaList: AreaModel[] = [];
  let fakeAreaService: any;
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
  let fakeWorkItemLinkTypes: Object;

  beforeEach(() => {

    fakeUserList = [
      {
        attributes: {
          fullName: 'WIDCT Example User 0',
          imageURL: 'https://avatars.githubusercontent.com/u/000?v=3'
        },
        id: 'widct-user0'
      }, {
        attributes: {
          fullName: 'WIDCT Example User 1',
          imageURL: 'https://avatars.githubusercontent.com/u/001?v=3'
        },
        id: 'widct-user1'
      }, {
        attributes: {
          fullName: 'WIDCT Example User 2',
          imageURL: 'https://avatars.githubusercontent.com/u/002?v=3'
        },
        id: 'widct-user2'
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

    fakeArea = {
      'attributes': {
        'name': 'Area 1'
      },
      'type': 'areas'

    } as AreaModel;

    fakeAreaList.push(fakeArea);

    fakeIteration = {
      'attributes': {
        'name': 'Iteration 1'
      },
      'type': 'iterations'

    } as IterationModel;

    fakeIterationList.push(fakeIteration);

    fakeWorkItemStates = [
      { option: 'new' },
      { option: 'open' },
      { option: 'in progress' },
      { option: 'resolved' },
      { option: 'closed' }
    ];

    fakeUser = {
      attributes: {
        'fullName': 'WIDCT Example User 2',
        'imageURL': 'https://avatars.githubusercontent.com/u/002?v=3'
      },
      id: 'widct-user2'
    } as User;

    fakeWorkItemTypes = [
      { attributes: { name: 'system.userstory' } },
      { attributes: { name: 'system.valueproposition' } },
      { attributes: { name: 'system.fundamental' } },
      { attributes: { name: 'system.experience' } },
      { attributes: { name: 'system.feature' } },
      { attributes: { name: 'system.bug' } }
    ] as WorkItemType[];

    fakeWorkItemLinkTypes = {'forwardLinks': [
        {
         'id': '4f8d8e8c-ab1c-4396-b725-105aa69a789c',
         'type': 'workitemlinktypes',
         'attributes': {
          'description': 'A test work item can if a the code in a pull request passes the tests.',
          'forward_name': 'story-story',
          'name': 'story-story',
          'reverse_name': 'story by',
          'topology': 'network',
          'version': 0
        },
        // 'id': '40bbdd3d-8b5d-4fd6-ac90-7236b669af04',
        'relationships': {
          'link_category': {
            'data': {
              'id': 'c08d244f-ca36-4943-b12c-1cdab3525f12',
              'type': 'workitemlinkcategories'
            }
          },
          'source_type': {
            'data': {
              'id': 'system.userstory',
              'type': 'workitemtypes'
            }
          },
          'target_type': {
            'data': {
              'id': 'system.userstory',
              'type': 'workitemtypes'
            }
          }
      }
    }],
    'backwardLinks': [{
         'id': '9cd02068-d76e-4733-9df8-f18bc39002ee',
         'type': 'workitemlinktypes',
         'attributes': {
          'description': 'A test work item can if a the code in a pull request passes the tests.',
          'forward_name': 'abc-abc',
          'name': 'abc-abc',
          'reverse_name': 'story by',
          'topology': 'network',
          'version': 0
        },
        // 'id': '40bbdd3d-8b5d-4fd6-ac90-7236b669af04',
        'relationships': {
          'link_category': {
            'data': {
              'id': 'c08d244f-ca36-4943-b12c-1cdab3525f12',
              'type': 'workitemlinkcategories'
            }
          },
          'source_type': {
            'data': {
              'id': 'system.userstory',
              'type': 'workitemtypes'
            }
          },
          'target_type': {
            'data': {
              'id': 'system.userstory',
              'type': 'workitemtypes'
            }
          }
      }
    }]};


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

    fakeAreaService = {
      getAreas: function () {
        return Observable.of(fakeAreaList);
      },
      getArea: function (area) {
        return Observable.of(fakeAreaList[0]);
      }
    };

    fakeIterationService = {
      getIterations: function () {
        return Observable.of(fakeIterationList);
      },

      getIteration: function (it) {
        return Observable.of(fakeIterationList[0]);
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

    fakeWorkItemService = {
      create: function () {
        return Observable.of(fakeWorkItem);
      },
      update: function (payload) {
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
      },

      getLinkTypes: function () {
        return Observable.of(fakeWorkItemLinkTypes);
      },

      resolveAssignees: function(assignees) {
        return Observable.of(fakeUserList[2]);
      },

      resolveCreator2: function(creator) {
        return Observable.of(fakeUserList[0]);
      },

      resolveLinks: function(url) {
        return Observable.of([[], []]);
      },

      resolveComments: function() {
        return Observable.of([ [], {data: []} ]);
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
        AlmIconModule,
        AlmEditableModule,
        BrowserAnimationsModule,
        CollapseModule,
        CommonModule,
        DropdownModule,
        FormsModule,
        ModalModule,
        ReactiveFormsModule,
        MyDatePickerModule,
        RouterTestingModule.withRoutes([
          // this needs to be a relative path but I don't know how to do that in a test
          { path: './detail/1', component: WorkItemDetailComponent }
        ]),
        TooltipModule,
        Ng2CompleterModule
      ],

      declarations: [
        AlmAvatarSize,
        AlmLinkTarget,
        AlmMomentTime,
        AlmSearchHighlight,
        AlmTrim,
        AlmUserName,
        WorkItemCommentComponent,
        WorkItemDetailComponent,
        DynamicFieldComponent,
        TypeaheadDropdown,
        MarkdownControlComponent,
        WorkItemLinkComponent,
        WorkItemLinkTypeFilterByTypeName,
        WorkItemLinkFilterByTypeName
      ],
      providers: [
        Broadcaster,
        ComponentLoaderFactory,
        DropdownConfig,
        Logger,
        Location,
        WorkItemTypeControlService,
        {
          provide: AuthenticationService,
          useValue: fakeAuthService
        },
        {
          provide: AreaService,
          useValue: fakeAreaService
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
        },
        PositioningService,
        TooltipConfig,
        {
          provide: Spaces,
          useExisting: SpacesService
        },
        SpacesService
      ]
    }).compileComponents()
      .then(() => {
        fixture = TestBed.createComponent(WorkItemDetailComponent);
        comp = fixture.componentInstance;
        comp.users = fakeUserList;
        currentUser = fakeUserService.getSavedLoggedInUser();
      });
  }));

  it('Page should display work item ID when logged in', () => {
    fakeAuthService.login();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('#wi-detail-id'));
    expect(el.nativeElement.textContent).toContain(fakeWorkItem.id);
  });

  it('Page should display work item ID when not logged in', () => {
    fakeAuthService.logout();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('#wi-detail-id'));
    expect(el.nativeElement.textContent).toContain(fakeWorkItem.id);
  });

  it('Work item ID cannot be edited (change model) ', () => {
    fakeAuthService.login();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('#wi-detail-id'));
    comp.workItemPayload = comp.workItem;
    comp.workItem.id = 'New ID';
    comp.save(comp.workItem);
    expect(el.nativeElement.textContent).not.toEqual(comp.workItem.id);
  });

  it('Work item ID cannot be edited (change html) ', () => {
    fakeAuthService.login();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('#wi-detail-id'));
    comp.workItemPayload = comp.workItem;
    el.nativeElement.textContent = 'New ID';
    comp.save();
    expect(comp.workItem.id).not.toEqual(el.nativeElement.textContent);
  });

  it('Page should display page title when logged in', () => {
    fakeAuthService.login();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('#wi-detail-title-click'));
    expect(el.nativeElement.textContent).toContain(fakeWorkItem.attributes['system.title']);
  });

  it('Page should display page title when not logged in', () => {
    fakeAuthService.logout();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('#wi-detail-title-ne'));
    expect(el.nativeElement.textContent).toContain(fakeWorkItem.attributes['system.title']);
  });

  it('Edit icon displayed when logged in', () => {
    fakeAuthService.login();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('.pficon-edit'));
    expect(el.attributes['id']).toBeDefined();
  });

  it('Edit icon to be undefined when not logged in', () => {
    fakeAuthService.logout();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('.pficon-edit'));
    expect(el).toBeNull();
  });

  it('Page should display non-editable work item title when not logged in', () => {
    fakeAuthService.logout();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('#wi-detail-title-ne'));
    expect(el.nativeElement.textContent).toContain(fakeWorkItem.attributes['system.title']);
  });

  it('Page should display clickable work item title when looged in', () => {
    fakeAuthService.login();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('#wi-detail-title-click'));
    expect(el.nativeElement.textContent).toContain(fakeWorkItem.attributes['system.title']);
  });

  it('Page should display editable work item title when logged in', () => {
    fakeAuthService.login();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    comp.openHeader();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('#wi-detail-title'));
    expect(el.nativeElement.innerText).toContain(fakeWorkItem.attributes['system.title']);
  });

  it('Work item title can be edited when logged in', () => {
    fakeAuthService.login();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    comp.openHeader();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('#wi-detail-title'));
    comp.workItemPayload = comp.workItem;
    comp.workItem.attributes['system.title'] = 'User entered valid work item title';
    fixture.detectChanges();
    comp.save();
    expect(comp.workItem.attributes['system.title']).toContain(el.nativeElement.innerText);
  });

  it('Save should be enabled if a valid work item title has been entered', () => {
    fakeAuthService.login();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    comp.openHeader();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('#workItemTitle_btn_save'));
    comp.workItemPayload = comp.workItem;
    comp.workItem.attributes['system.title'] = 'Valid work item title';
    fixture.detectChanges();
    comp.save();
    expect(el.classes['disabled']).toBeFalsy();
  });

  it('Save should be disabled if the work item title is blank', () => {
    fakeAuthService.login();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    comp.openHeader();
    fixture.detectChanges();
    comp.titleText = '';
    comp.isValid(comp.titleText);
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('#workItemTitle_btn_save'));
    fixture.detectChanges();
    expect(el.classes['disabled']).toBeTruthy();
  });

  // These tests doesn't belong to here anymore
  // There should be respective unit tests in markdown-control

  // it('Work item description can be edited when logged in', () => {
  //   fakeAuthService.login();
  //   fixture.detectChanges();
  //   comp.workItem = fakeWorkItem;
  //   comp.loggedIn = fakeAuthService.isLoggedIn();
  //   fixture.detectChanges();
  //   comp.openDescription();
  //   fixture.detectChanges();
  //   el = fixture.debugElement.query(By.css('#detail-desc-value'));
  //   comp.workItemPayload = comp.workItem;
  //   comp.workItem.attributes['system.description'] = 'User entered work item description';
  //   fixture.detectChanges();
  //   comp.save();
  //   expect(comp.workItem.attributes['system.description']).toContain(el.nativeElement.innerHTML);
  // });

  // it('Work item description cannot be edited when logged out', () => {
  //   fakeAuthService.logout();
  //   fixture.detectChanges();
  //   comp.workItem = fakeWorkItem;
  //   comp.loggedIn = fakeAuthService.isLoggedIn();
  //   fixture.detectChanges();
  //   el = fixture.debugElement.query(By.css('#wi-detail-desc'));
  //   expect(el.attributes['disabled']);
  // });

  it('Work item state can be edited when logged in', () => {
    fakeAuthService.login();
    fixture.detectChanges();
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('#wi-detail-state'));
    comp.workItem.type = 'resolved';
    fixture.detectChanges();
    expect(comp.workItem.attributes['system.state']).toContain(el.nativeElement.value);
  });

  it('should not open the user list if not logged in', () => {
    comp.activeSearchAssignee();
    fixture.detectChanges();
    expect(comp.searchAssignee).toBeFalsy();
  });

  it('should open the user list if logged in', () => {
    fakeAuthService.login();
    fixture.detectChanges();
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    comp.activeSearchAssignee();
    fixture.detectChanges();
    expect(comp.searchAssignee).toBeTruthy();
  });

  it('Page should display correct assignee', () => {
    fakeAuthService.login();
    fixture.detectChanges();
    comp.workItemPayload = comp.workItem;
    comp.workItem = fakeWorkItem;
    comp.workItemPayload = comp.workItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();
    el = fixture.debugElement.query(By.css('#WI_details_assigned_user'));
    expect(el.nativeElement.textContent).toContain('WIDCT Example User 2');
  });

   it('page should display correct reporter', () => {
      fakeAuthService.login();
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      comp.loggedIn = fakeAuthService.isLoggedIn();
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#WI_details_reporter_user'));
      expect(el.nativeElement.textContent).toContain('Example User 0');
  });

   it('Should have a comment section', () => {
      fakeAuthService.login();
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      comp.loggedIn = fakeAuthService.isLoggedIn();
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#wi-comment'));
      expect(el.nativeElement).toBeTruthy();
  });

});
