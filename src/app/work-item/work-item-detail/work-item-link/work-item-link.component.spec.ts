// import {
//   async,
//   ComponentFixture,
//   fakeAsync,
//   inject,
//   TestBed,
//   tick
// } from '@angular/core/testing';

// import { Location }            from '@angular/common';
// import { SpyLocation }         from '@angular/common/testing';
// import { DebugElement }        from '@angular/core';
// import { FormsModule }         from '@angular/forms';
// import { By }                  from '@angular/platform-browser';
// import { RouterTestingModule } from '@angular/router/testing';
// import { CommonModule }        from '@angular/common';
// import { DropdownModule }     from 'ng2-dropdown';
// import { Ng2CompleterModule } from 'ng2-completer';

// import {
//   AuthenticationService,
//   Broadcaster,
//   Logger,
//   User,
//   UserService
// } from 'ngx-login-client';
//
// import { AlmLinkTarget } from '../../../../pipes/alm-link-target.pipe';
// import { Link } from '../../../../models/link';
// import { LinkType } from '../../../../models/link-type';
// import { WorkItem } from '../../../../models/work-item';
// import { WorkItemService } from '../../../work-item.service';
// // import { WorkItemDetailComponent } from '../work-item-detail.component';

// import { WorkItemLinkComponent } from './work-item-link.component';


// describe('WorkItem Links CRD -', () => {
//   let fixture: ComponentFixture<WorkItemLinkComponent>;
//   let comp: WorkItemLinkComponent;
//   let el: DebugElement;
//   let el1: DebugElement;
//   let logger: Logger;
//   let workItem: WorkItem;
//   let fakeWorkItem1: WorkItem;
//   let fakeWorkItem2: WorkItem;
//   let toLinkWorkItem: WorkItem;
//   let fakeWorkItems: WorkItem[] = [];
//   let fakeWorkItemMap: Object = {};
//   let fakeWorkItemLinkTypes : LinkType[];
//   let fakeWorkItemLinks : Link[];
//   let fakeAuthService: any;
//   let fakeWorkItemService: any;
//   let loggedIn: Boolean = false;
//   let fakeLink: Object;

//   beforeEach(() => {
//      workItem = {
//       'attributes': {
//         'system.created_at': null,
//         'system.description': null,
//         'system.remote_item_id': null,
//         'system.state': 'new',
//         'system.title': 'My work item',
//         'version': 0
//       },
//       'id': '1',
//       'relationships': {
//         'assignees': {
//           'data': [{
//             'id': '498c69a9-bb6f-464b-b89c-a1976ed46301',
//             'type': 'identities'
//           }]
//         },
//         'baseType': {
//           'data': {
//             'id': 'system.userstory',
//             'type': 'workitemtypes'
//           }
//         },
//         'creator': {
//           'data': {
//             'id': '498c69a9-bb6f-464b-b89c-a1976ed46301',
//             'type': 'identities'
//           }
//         }
//       },
//       'type': 'workitems'
//     } as WorkItem;

//      fakeWorkItem1 = {
//       'attributes': {
//         'system.created_at': null,
//         'system.description': null,
//         'system.remote_item_id': null,
//         'system.state': 'new',
//         'system.title': 'My work item',
//         'version': 0
//       },
//       'id': '1',
//       'relationships': {
//         'assignees': {
//           'data': [{
//             'id': '498c69a9-bb6f-464b-b89c-a1976ed46301',
//             'type': 'identities'
//           }]
//         },
//         'baseType': {
//           'data': {
//             'id': 'system.userstory',
//             'type': 'workitemtypes'
//           }
//         },
//         'creator': {}
//       },
//       'type': 'workitems'
//     } as WorkItem;

//     fakeWorkItem2 = {
//       'attributes': {
//         'system.created_at': null,
//         'system.description': null,
//         'system.remote_item_id': null,
//         'system.state': 'new',
//         'system.title': 'My work item',
//         'version': 0
//       },
//       'id': '4',
//       'relationships': {
//         'assignees': {
//           'data': [{
//             'id': '498c69a9-bb6f-464b-b89c-a1976ed46301',
//             'type': 'identities'
//           }]
//         },
//         'baseType': {
//           'data': {
//             'id': 'system.userstory',
//             'type': 'workitemtypes'
//           }
//         },
//         'creator': {}
//       },
//       'type': 'workitems'
//     } as WorkItem;

//     toLinkWorkItem = {
//       'attributes': {
//         'system.created_at': null,
//         'system.description': null,
//         'system.remote_item_id': null,
//         'system.state': 'new',
//         'system.title': 'To be linked workItem',
//         'version': 0
//       },
//       'id': '6',
//       'relationships': {
//         'assignees': {
//           'data': [{
//             'id': '498c69a9-bb6f-464b-b89c-a1976ed46301',
//             'type': 'identities'
//           }]
//         },
//         'baseType': {
//           'data': {
//             'id': 'system.userstory',
//             'type': 'workitemtypes'
//           }
//         },
//         'creator': {}
//       },
//       'type': 'workitems'
//     } as WorkItem;

//     fakeWorkItemMap['1'] = fakeWorkItem1;
//     fakeWorkItemMap['4'] = fakeWorkItem1;
//     fakeWorkItemMap['6'] = toLinkWorkItem;
//     fakeWorkItems.push(fakeWorkItem1);
//     fakeWorkItems.push(fakeWorkItem2);
//     // fakeWorkItems.push(fakeWorkItem3);

//     fakeWorkItemLinkTypes = [
//         {
//          'id': '4f8d8e8c-ab1c-4396-b725-105aa69a789c',
//          'type': 'workitemlinktypes',
//          'attributes': {
//           'description': 'A test work item can if a the code in a pull request passes the tests.',
//           'forward_name': 'story-story',
//           'name': 'story-story',
//           'reverse_name': 'story by',
//           'topology': 'network',
//           'version': 0
//         },
//         // 'id': '40bbdd3d-8b5d-4fd6-ac90-7236b669af04',
//         'relationships': {
//           'link_category': {
//             'data': {
//               'id': 'c08d244f-ca36-4943-b12c-1cdab3525f12',
//               'type': 'workitemlinkcategories'
//             }
//           },
//           'source_type': {
//             'data': {
//               'id': 'system.userstory',
//               'type': 'workitemtypes'
//             }
//           },
//           'target_type': {
//             'data': {
//               'id': 'system.userstory',
//               'type': 'workitemtypes'
//             }
//           }
//       }
//     },
//       {
//          'id': '9cd02068-d76e-4733-9df8-f18bc39002ee',
//          'type': 'workitemlinktypes',
//          'attributes': {
//           'description': 'A test work item can if a the code in a pull request passes the tests.',
//           'forward_name': 'abc-abc',
//           'name': 'abc-abc',
//           'reverse_name': 'story by',
//           'topology': 'network',
//           'version': 0
//         },
//         // 'id': '40bbdd3d-8b5d-4fd6-ac90-7236b669af04',
//         'relationships': {
//           'link_category': {
//             'data': {
//               'id': 'c08d244f-ca36-4943-b12c-1cdab3525f12',
//               'type': 'workitemlinkcategories'
//             }
//           },
//           'source_type': {
//             'data': {
//               'id': 'system.userstory',
//               'type': 'workitemtypes'
//             }
//           },
//           'target_type': {
//             'data': {
//               'id': 'system.userstory',
//               'type': 'workitemtypes'
//             }
//           }
//       }
//     }];

//     fakeLink = {
//             attributes: {
//                 version: 0
//             },
//             id: 'c241e025-87a4-4c59-aed0-8333de346666',
//             relationships: {
//                 link_type: {
//                 data: {
//                     id: '9cd02068-d76e-4733-9df8-f18bc39002ee',
//                     type: 'workitemlinktypes'
//                 }
//                 },
//                 source: {
//                 data: {
//                     id: '3',
//                     type: 'workitems'
//                 }
//                 },
//                 target: {
//                 data: {
//                     id: '6',
//                     type: 'workitems'
//                 }
//                 }
//             },
//             type: 'workitemlinks'
//         },

//     fakeWorkItemLinks = [
//         {
//             attributes: {
//                 version: 0
//             },
//             id: 'd66b0ad5-bca8-4642-a43c-80cc0c831b25',
//             relationships: {
//                 link_type: {
//                 data: {
//                     id: '4f8d8e8c-ab1c-4396-b725-105aa69a789c',
//                     type: 'workitemlinktypes'
//                 }
//                 },
//                 source: {
//                 data: {
//                     id: '3',
//                     type: 'workitems'
//                 }
//                 },
//                 target: {
//                 data: {
//                     id: '4',
//                     type: 'workitems'
//                 }
//                 }
//             },
//             type: 'workitemlinks'
//         },
//         {
//             attributes: {
//                 version: 0
//             },
//             id: 'c241e025-87a4-4c59-aed0-8333de346666',
//             relationships: {
//                 link_type: {
//                 data: {
//                     id: '9cd02068-d76e-4733-9df8-f18bc39002ee',
//                     type: 'workitemlinktypes'
//                 }
//                 },
//                 source: {
//                 data: {
//                     id: '3',
//                     type: 'workitems'
//                 }
//                 },
//                 target: {
//                 data: {
//                     id: '6',
//                     type: 'workitems'
//                 }
//                 }
//             },
//             type: 'workitemlinks'
//         },
//         {
//             attributes: {
//                 version: 0
//             },
//             id: 'dcaff8b1-8d4d-40c9-9408-c0f4dc1961c7',
//             relationships: {
//                 link_type: {
//                 data: {
//                     id: '4f8d8e8c-ab1c-4396-b725-105aa69a789c',
//                     type: 'workitemlinktypes'
//                 }
//                 },
//                 source: {
//                 data: {
//                     id: '3',
//                     type: 'workitems'
//                 }
//                 },
//                 target: {
//                 data: {
//                     id: '1',
//                     type: 'workitems'
//                 }
//                 }
//             },
//             type: 'workitemlinks'
//         }
//     ];

//     fakeAuthService = {

//       getToken: function () {
//         return '';
//       },
//       isLoggedIn: function() {
//         return this.loggedIn;
//       },
//       login: function() {
//         this.loggedIn = true;
//       },

//       logout: function() {
//         this.loggedIn = false;
//       }
//     };

//     fakeWorkItemService = {
//       getLocallySavedWorkItems: function() {
//         return new Promise((resolve, reject) => {
//           resolve(fakeWorkItems);
//         });
//       },
//       getAllLinks: function () {
//         return new Promise((resolve, reject) => {
//           resolve(fakeWorkItemLinks);
//         });
//       },
//       getLinkTypes: function () {
//         return new Promise((resolve, reject) => {
//           resolve(fakeWorkItemLinkTypes);
//         });
//       },
//       createLink: function () {
//         return new Promise((resolve, reject) => {
//           resolve(fakeLink);
//         });
//       },

//       deleteLink: function() {
//         return new Promise((resolve, reject) => {
//           resolve(fakeLink);
//         });
//       }
//     };

//   });
//   beforeEach(async(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         Ng2CompleterModule,
//         RouterTestingModule.withRoutes([
//           {path: 'work-item/list/detail/1', component: WorkItemLinkComponent}
//         ]),
//       ],

//       declarations: [
//         AlmLinkTarget,
//         WorkItemLinkComponent,
//       ],
//       providers: [
//         Logger,
//         Location,
//         {
//           provide: WorkItemService,
//           useValue: fakeWorkItemService
//         }
//       ]
//     }).compileComponents()
//       .then(() => {
//         fixture = TestBed.createComponent(WorkItemLinkComponent);
//         comp = fixture.componentInstance;
//       });
//   }));

//   it('Dont Show Link creator when not logged in', () => {
//     comp.loggedIn = fakeAuthService.isLoggedIn();
//     fixture.detectChanges();
//     comp.toggleLinkComponent();
//     fixture.detectChanges();
//     comp.linkTypes = fakeWorkItemLinkTypes;
//     comp.workItem = workItem;
//     comp.totalLinks = fakeWorkItemLinks.length;
//     comp.selectedLinkType = fakeWorkItemLinkTypes[1];
//     fixture.detectChanges();
//     el = fixture.debugElement.query(By.css('#wi-link-editor'));
//     expect(el).toBeNull();
//   });

//   it('Show Link creator when logged in', () => {
//     fakeAuthService.login();
//     fixture.detectChanges();
//     comp.loggedIn = fakeAuthService.isLoggedIn();
//     fixture.detectChanges();
//     comp.toggleLinkComponent();
//     fixture.detectChanges();
//     comp.linkTypes = fakeWorkItemLinkTypes;
//     comp.workItem = workItem;
//     comp.totalLinks = fakeWorkItemLinks.length;
//     comp.selectedLinkType = fakeWorkItemLinkTypes[1];
//     fixture.detectChanges();
//     el = fixture.debugElement.query(By.css('#wi-link-editor'));
//     expect(el).toBeDefined();
//   });

//   it('Check for Total links', () => {
//     comp.workitemLinks = fakeWorkItemLinks;
//     comp.linkTypes = fakeWorkItemLinkTypes;
//     comp.workItem = workItem;
//     comp.totalLinks = fakeWorkItemLinks.length;
//     fixture.detectChanges();
//     el = fixture.debugElement.query(By.css('#wi-link-total'));
//     expect(el.nativeElement.textContent).toContain(fakeWorkItemLinks.length);
//   });


//   it('Display all links', () => {
//     comp.toggleLinkComponent();
//     fixture.detectChanges();
//     comp.workItem = workItem;
//     comp.workItemsMap = fakeWorkItemMap;
//     comp.linkTypes = fakeWorkItemLinkTypes;
//     comp.workitemLinks = fakeWorkItemLinks;
//     comp.totalLinks = fakeWorkItemLinks.length;
//     fixture.detectChanges();
//     let toCheckLinkId = fakeWorkItemLinks[0].id;
//     el = fixture.debugElement.query(By.css('#' + toCheckLinkId));
//     expect(el).toBeDefined();
//   });

//   it('Create Link', () => {
//     comp.toggleLinkComponent();
//     comp.workItem = workItem;
//     comp.linkTypes = fakeWorkItemLinkTypes;
//     comp.workItemsMap = fakeWorkItemMap;
//     comp.workitemLinks = fakeWorkItemLinks;
//     comp.totalLinks = fakeWorkItemLinks.length;
//     comp.selectedWorkItem = toLinkWorkItem;
//     comp.selectedLinkType = fakeWorkItemLinkTypes[1];
//     comp.createLink();
//     fixture.detectChanges();
//     comp.workItemsMap = fakeWorkItemMap;
//     fixture.detectChanges();
//     el = fixture.debugElement.query(By.css('#' + fakeLink['id'] + '-text' ));
//     expect(true).toBe(true);
//   });

// });
