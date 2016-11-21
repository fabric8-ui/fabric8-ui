import {
  async,
  ComponentFixture,
  fakeAsync,
  inject,
  TestBed,
  tick
} from '@angular/core/testing';

import { Location }            from '@angular/common';
import { SpyLocation }         from '@angular/common/testing';
import { DebugElement }        from '@angular/core';
import { FormsModule }         from '@angular/forms';
import { By }                  from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule }       from '@angular/common';
import { DropdownModule }     from 'ng2-dropdown';

import { AlmTrim } from './../../../pipes/alm-trim';
import { AlmSearchHighlight } from './../../../pipes/alm-search-highlight.pipe';
import { Broadcaster } from './../../../shared/broadcaster.service';
import { Logger } from './../../../shared/logger.service';

import { Dialog } from './../../../shared-component/dialog/dialog';


import { AlmIconModule }      from './../../../shared-component/icon/almicon.module';
import { AlmEditableModule }      from './../../../shared-component/editable/almeditable.module';
import { AuthenticationService } from './../../../auth/authentication.service';
import { User, NewUser } from './../../../user/user';
import { UserService } from './../../../user/user.service';
import { WorkItem } from './../../work-item';
import { WorkItemType } from './../../work-item-type';
import { WorkItemService } from './../../work-item.service';

import { WorkItemDetailComponent } from './work-item-detail.component';

describe('Detailed view and edit a selected work item - ', () => {
  let comp: WorkItemDetailComponent;
  let fixture: ComponentFixture<WorkItemDetailComponent>;
  let el: DebugElement;
  let el1: DebugElement;
  let logger: Logger;
  let fakeWorkItem: WorkItem;
  let fakeUser: User;
  let fakeUserList: NewUser[];
  let fakeWorkItemService: any;
  let fakeAuthService: any;
  let fakeUserService: any;
  let fakeWorkItemTypes: WorkItemType[];
  let fakeWorkItemStates: Object[];

  beforeEach(() => 
{

    fakeWorkItem = {
      'fields': {
        'system.assignee': '498c69a9-bb6f-464b-b89c-a1976ed46301',
        'system.creator': 'me',
        'system.description': 'description',
        'system.state': 'new',
        'system.title': 'My work item'
      },
      'id': '1',
      'type': 'system.userstory',
      'version': 0
    } as WorkItem;

    fakeWorkItemStates = [
      { option: 'new' },
      { option: 'open' },
      { option: 'in progress' },
      { option: 'resolved' },
      { option: 'closed' }
    ];

    fakeUser = {
      'fullName': 'Draco Malfoy',
      'imageURL': 'http://www.hercampus.com/sites/default/files/2016/01/05/tom-felton-as-draco-malfoy-from-harry-potter.jpg'
    } as User;

    fakeUserList = [
        {
          attributes: {
            fullName: 'Harry Potter',
            imageURL: 'http://nerdist.com/wp-content/uploads/2016/02/20160210_nerdistnews_harrypottercursedchild_1x1.jpg'
          },
          id: '779efdcc-ac87-4720-925e-949ff21dbf5d'
        }, {
          attributes: {
            fullName: 'Walter Mitty',
            imageURL: 'http://bestwatchbrandshq.com/wp-content/uploads/2015/01/Ben-Stiller-Watch-In-The-Secret-Life-Of-Walter-Mitty-Movie-9.jpg'
          },
          id: '39d44ed6-1246-48d6-9190-51ffab67c42e'
        }, {
          attributes: {
            fullName: 'Draco Malfoy',
            imageURL: 'http://www.hercampus.com/sites/default/files/2016/01/05/tom-felton-as-draco-malfoy-from-harry-potter.jpg'
          },
          id: '498c69a9-bb6f-464b-b89c-a1976ed46301'
        }
      ] as NewUser[];

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
      isLoggedIn: function() {
        return this.loggedIn;
      },
      login: function() {
        this.loggedIn = true;
      },

      logout: function() {
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
        RouterTestingModule.withRoutes([
          {path: 'work-item-list/detail/1', component: WorkItemDetailComponent}
        ]),
        CommonModule,
        DropdownModule,
        AlmIconModule,
        AlmEditableModule
      ],

      declarations: [
        WorkItemDetailComponent,
        AlmTrim,
        AlmSearchHighlight
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
        fixture = TestBed.createComponent(WorkItemDetailComponent);
        comp = fixture.componentInstance;
        comp.users = fakeUserList;
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
      comp.workItem.id = 'New ID';      
      comp.save();      
      expect(el.nativeElement.textContent).not.toEqual(comp.workItem.id);
  });

  it('Work item ID cannot be edited (change html) ', () => {      
      fakeAuthService.login();
      fixture.detectChanges();      
      comp.workItem = fakeWorkItem;
      comp.loggedIn = fakeAuthService.isLoggedIn();
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#wi-detail-id'));      
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
    expect(el.nativeElement.textContent).toContain(fakeWorkItem.fields['system.title']);
  });

  it('Page should display page title when not logged in', () => {      
    fakeAuthService.logout();
    fixture.detectChanges();      
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();
    fixture.detectChanges();      
    el = fixture.debugElement.query(By.css('#wi-detail-title-ne'));
    expect(el.nativeElement.textContent).toContain(fakeWorkItem.fields['system.title']);
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
    expect(el.nativeElement.textContent).toContain(fakeWorkItem.fields['system.title']);
  });

  it('Page should display clickable work item title when looged in', () => {
    fakeAuthService.login();
    fixture.detectChanges();      
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();           
    fixture.detectChanges();    
    el = fixture.debugElement.query(By.css('#wi-detail-title-click'));
    expect(el.nativeElement.textContent).toContain(fakeWorkItem.fields['system.title']);
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
    expect(el.nativeElement.innerText).toContain(fakeWorkItem.fields['system.title']);
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
    comp.workItem.fields['system.title'] = 'User entered valid work item title';      
    fixture.detectChanges();
    comp.save();
    expect(comp.workItem.fields['system.title']).toContain(el.nativeElement.innerText);
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
    comp.workItem.fields['system.title'] = 'Valid work item title';
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

  it('Work item description can be edited when logged in', () => {
    fakeAuthService.login();
    fixture.detectChanges();         
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();           
    fixture.detectChanges();    
    comp.openDescription();
    fixture.detectChanges();    
    el = fixture.debugElement.query(By.css('#wi-detail-desc'));
    comp.workItem.fields['system.description'] = 'User entered work item description';      
    fixture.detectChanges();
    comp.save();
    expect(comp.workItem.fields['system.description']).toContain(el.nativeElement.innerHTML);
  });

  it('Work item description cannot be edited when logged out', () => {
    fakeAuthService.logout();
    fixture.detectChanges();         
    comp.workItem = fakeWorkItem;
    comp.loggedIn = fakeAuthService.isLoggedIn();           
    fixture.detectChanges();    
    el = fixture.debugElement.query(By.css('#wi-detail-desc'));
    expect(el.attributes['disabled']);
  });

  // Commenting this out because no type text in the new design
  
  // it('Work item type can be edited when logged in', () => {
  //   fakeAuthService.login();
  //   fixture.detectChanges();         
  //   comp.workItem = fakeWorkItem;
  //   comp.loggedIn = fakeAuthService.isLoggedIn();           
  //   fixture.detectChanges(); 
  //   el = fixture.debugElement.query(By.css('#wi-detail-type'));
  //   comp.workItem.type = 'system.experience';
  //   fixture.detectChanges();
  //   expect(comp.workItem.type).toContain(el.nativeElement.value);
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
    expect(comp.workItem.fields['system.state']).toContain(el.nativeElement.value);
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

  it('should return correct user info from getAssignedUserDetails', () => {
    let foundUser: any = comp.getAssignedUserDetails('39d44ed6-1246-48d6-9190-51ffab67c42e');
    expect(foundUser.fullName).toBe('Walter Mitty');
  });

  it('should return null from getAssignedUserDetails in case not found', () => {
    let foundUser: any = comp.getAssignedUserDetails('39d44ed6-1246-48d6-9190-51ffab6312-0391-012');
    expect(foundUser).toBeNull();
  });

  it('Page should display correct assignee', () => {
      fakeAuthService.login();
      fixture.detectChanges();
      comp.workItem = fakeWorkItem;
      comp.loggedIn = fakeAuthService.isLoggedIn();
      comp.assignedUser = comp.getAssignedUserDetails(comp.workItem.fields['system.assignee']);
      fixture.detectChanges();
      el = fixture.debugElement.query(By.css('#WI_details_assigned_user'));      
      expect(el.nativeElement.textContent).toContain('Draco Malfoy');
  });

});
