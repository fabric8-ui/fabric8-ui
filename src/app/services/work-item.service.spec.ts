import { HttpErrorResponse } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Response, ResponseOptions } from '@angular/http';
import { Logger } from 'ngx-base';
import { Spaces, WIT_API_URL } from 'ngx-fabric8-wit';
import {
    UserService
} from 'ngx-login-client';
import { Observable } from 'rxjs';

import { WorkItem } from './../models/work-item';
import { AreaService } from './area.service';
import { HttpService } from './http-service';
import { WorkItemService } from './work-item.service';
import {
    commentsSnapshot,
    getMoreWorkItemResponseSnapshot,
    getSingleWorkItemSnapShot,
    getWorkItemResponseSnapshot,
    linkResponseSnapShot,
    resolveLinkExpectedOutputSnapShot,
    workItemEventsSnapshot,
    workItemSnapshot
} from './work-item.snapshot';

describe('Unit Test :: WorkItemService', () => {
    beforeEach(() => {
        const mockHttpService = jasmine.createSpyObj(
            'HttpService', ['get']
        );

        const mockLoggerService = jasmine.createSpyObj(
            'LoggerService', ['log']
        );

        const mockAreaService = jasmine.createSpyObj(
            'AreaService', ['getAreas']
        );

        const mockUserService = jasmine.createSpyObj(
            'AreaService', ['getSavedLoggedInUser', 'getLocallySavedUsers']
        );

        TestBed.configureTestingModule({
            providers: [{
                provide: HttpService,
                useValue: mockHttpService
            }, {
                provide: Logger,
                useValue: mockLoggerService
            }, {
                provide: AreaService,
                useValue: mockAreaService
            }, {
                provide: UserService,
                useValue: mockUserService
            }, {
                provide: Spaces,
                useValue: { current: Observable.of({}) }
            }, {
                provide: WIT_API_URL,
                useValue: ''
            },
            WorkItemService
        ]
        });
    });

    afterEach(() => {
    });

    it('cannery :: Should pass the cannery test', (done) => {
        const wiService = TestBed.get(WorkItemService);
        expect(wiService).not.toBeNull();
        expect(wiService).not.toBeUndefined();
        done();
    });

    it('logger :: Should call logger.log during class construction and on call notifyError', (done) => {
        const wiService = TestBed.get(WorkItemService);
        expect(wiService.logger.log.calls.count())
            .toBe(1, 'During construction');
        wiService.notifyError('Some error', {message: 'Some error'});
        expect(wiService.logger.log.calls.count())
            .toBe(2, 'During notifyError call');
        done();
    });

    it('createId :: Should create an instance ID of 5 charecter', (done) => {
        const wiService = TestBed.get(WorkItemService);
        const id = wiService.createId();
        expect(typeof(id)).toBe('string');
        expect(id.length).toBe(5, 'The length of the ID is not 5');
        done();
    });

    it('getChildren :: Should get the list of workitems when getChildren is called', (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService.http.get.and.returnValue(
            Observable.of(new Response(
                new ResponseOptions({
                    body: JSON.stringify(workItemSnapshot),
                    status: 200
                })
            )).delay(100)
        );
        wiService.getChildren('')
            .subscribe((data) => {
                expect(data).toEqual(workItemSnapshot.data);
                done();
            });
    });

    it('getWorkItems :: Should get the list of workitems in proper format when getWorkItems is called', (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService['_currentSpace'] = {
            links: { self: '' }
        };
        wiService.http.get.and.returnValue(
            Observable.of(new Response(
                new ResponseOptions({
                    body: JSON.stringify(workItemSnapshot),
                    status: 200
                })
            )).delay(100)
        );
        wiService.getWorkItems('', {})
            .subscribe((data) => {
                expect(data).toEqual(getWorkItemResponseSnapshot);
                done();
            });
    });

    it('getWorkItems :: Should call notifyError if error response comes', (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService['_currentSpace'] = {
            links: { self: '' }
        };
        wiService.http.get.and.returnValue(
            Observable.throw(new Error('Internal service error'))
            .delay(100)
        );
        spyOn(wiService, 'notifyError');
        wiService.getWorkItems('', {})
            .subscribe(
                () => {},
                (err) => {
                    expect(wiService.notifyError).toHaveBeenCalledTimes(1);
                    done();
                }
            );
    });

    it('getWorkItems :: Should return an empty list if space not found', (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService['_currentSpace'] = null;
        wiService.getWorkItems('', {})
            .subscribe((data) => {
                expect(data.workItems.length).toBe(0);
                expect(data.nextLink).toBeNull();
                done();
            });
    });

    it('getMoreWorkItems :: Should get the list of workitems in proper format when getMoreWorkItems is called', (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService.http.get.and.returnValue(
            Observable.of(new Response(
                new ResponseOptions({
                    body: JSON.stringify(workItemSnapshot),
                    status: 200
                })
            )).delay(100)
        );
        wiService.getMoreWorkItems('spme/url')
            .subscribe((data) => {
                expect(data).toEqual(getMoreWorkItemResponseSnapshot);
                done();
            });
    });

    it('getMoreWorkItems :: Should call notifyError if error response comes', (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService.http.get.and.returnValue(
            Observable.throw(new Error('Internal service error'))
            .delay(100)
        );
        spyOn(wiService, 'notifyError');
        wiService.getMoreWorkItems('some/url')
            .subscribe(
                () => {},
                (err) => {
                    expect(wiService.notifyError).toHaveBeenCalledTimes(1);
                    done();
                }
            );
    });

    it('getMoreWorkItems :: Should `No more item found` error when url is null or empty', (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService.getMoreWorkItems('')
            .subscribe(
                () => {},
                (err) => {
                    expect(err).toBe('No more item found');
                    done();
                }
            );
    });

    it('getWorkItemByNumber :: Should return empty workItem if there is no currentSpace', (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService['_currentSpace'] = null;
        wiService.getWorkItemByNumber('1', 'owner1', 'space1')
            .subscribe((data) => {
                expect(data).toEqual(new WorkItem());
                done();
            });
    });

    it(`getWorkItemByNumber :: Should construct the right URL if 'owner' is
        not provided considering to fetch workItem by the ID`, (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService['_currentSpace'] = {
            links: { self: 'link/to/spaces/' }
        };
        wiService.http.get.and.returnValue(
            Observable.of(new Response(
                new ResponseOptions({
                    body: JSON.stringify(getSingleWorkItemSnapShot),
                    status: 200
                })
            )).delay(100)
        );
        // We are providing the owner name as empty to the function
        wiService.getWorkItemByNumber('1', '', 'space1')
            .subscribe((data) => {
                expect(wiService.http.get).toHaveBeenCalledWith('link/to/workitems/1');
                expect(data).toEqual(getSingleWorkItemSnapShot.data);
                done();
            });
    });

    it(`getWorkItemByNumber :: Should construct the right URL if 'space'
        is not provided considering to fetch workItem by the ID`, (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService['_currentSpace'] = {
            links: { self: 'link/to/spaces/' }
        };
        wiService.http.get.and.returnValue(
            Observable.of(new Response(
                new ResponseOptions({
                    body: JSON.stringify(getSingleWorkItemSnapShot),
                    status: 200
                })
            )).delay(100)
        );
        // We are providing the space name as empty to the function
        wiService.getWorkItemByNumber('1', 'owner1', '')
            .subscribe((data) => {
                expect(wiService.http.get).toHaveBeenCalledWith('link/to/workitems/1');
                expect(data).toEqual(getSingleWorkItemSnapShot.data);
                done();
            });
    });

    it(`getWorkItemByNumber :: Should log error when work item is requested by
        the ID considering 'space' or 'owner' is not provided`, (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService['_currentSpace'] = {
            links: { self: 'link/to/spaces/' }
        };
        wiService.http.get.and.returnValue(
            Observable.throw(Observable.throw(new Error('Internal service error')))
            .delay(100)
        );
        spyOn(wiService, 'notifyError');
        // We are providing the space name as empty to the function
        wiService.getWorkItemByNumber('1', 'owner1', '')
            .subscribe(
                () => {},
                (err) => {
                    expect(wiService.http.get).toHaveBeenCalledWith('link/to/workitems/1');
                    expect(wiService.notifyError).toHaveBeenCalledTimes(1);
                    done();
                }
            );
    });

    it(`getWorkItemByNumber :: Should construct the right URL if 'owner' and
        'space' are provided considering to fetch workItem by the number`, (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService['_currentSpace'] = {
            links: { self: 'link/to/spaces/' }
        };
        wiService.http.get.and.returnValue(
            Observable.of(new Response(
                new ResponseOptions({
                    body: JSON.stringify(getSingleWorkItemSnapShot),
                    status: 200
                })
            )).delay(100)
        );
        // We are providing the owner name as empty to the function
        wiService.getWorkItemByNumber('1', 'owner1', 'space1')
            .subscribe((data) => {
                expect(wiService.http.get).toHaveBeenCalledWith(
                    'link/to/namedspaces/owner1/space1/workitems/1',
                    {'no-header': null}
                );
                expect(data).toEqual(getSingleWorkItemSnapShot.data);
                done();
            });
    });

    it(`getWorkItemByNumber :: Should log error when work item is requested by
        the number considering 'space' or 'owner' is provided`, (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService['_currentSpace'] = {
            links: { self: 'link/to/spaces/' }
        };
        wiService.http.get.and.returnValue(
            Observable.throw(Observable.throw(new Error('Internal service error')))
            .delay(100)
        );
        spyOn(wiService, 'notifyError');
        // We are providing the space name as empty to the function
        wiService.getWorkItemByNumber('1', 'owner1', 'space1')
            .subscribe(
                () => {},
                (err) => {
                    expect(wiService.http.get).toHaveBeenCalledWith(
                        'link/to/namedspaces/owner1/space1/workitems/1',
                        {'no-header': null}
                    );
                    expect(wiService.notifyError).toHaveBeenCalledTimes(1);
                    done();
                }
            );
    });

    it('getEvents :: Should return the list of events', (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService.http.get.and.returnValue(
            Observable.of(new Response(
                new ResponseOptions({
                    body: JSON.stringify(workItemEventsSnapshot),
                    status: 200
                })
            )).delay(100)
        );
        wiService.getEvents('link/to/events')
            .subscribe((data) => {
                expect(data).toEqual(workItemEventsSnapshot.data);
                done();
            });
    });

    it('resolveComments :: Should fetch comments', (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService.http.get.and.returnValue(
            Observable.of(new Response(
                new ResponseOptions({
                    body: JSON.stringify(commentsSnapshot),
                    status: 200
                })
            )).delay(100)
        );
        wiService.resolveComments('link/to/comments')
            .subscribe((data) => {
                expect(data).toEqual(commentsSnapshot);
                done();
            });
    });

    it('resolveLinks :: Should fetch links', (done) => {
        const wiService = TestBed.get(WorkItemService);
        wiService.http.get.and.returnValue(
            Observable.of(new Response(
                new ResponseOptions({
                    body: JSON.stringify(linkResponseSnapShot),
                    status: 200
                })
            )).delay(100)
        );
        wiService.resolveLinks('link/to/links')
            .subscribe((data) => {
                expect(data).toEqual(resolveLinkExpectedOutputSnapShot);
                done();
            });
    });
});
