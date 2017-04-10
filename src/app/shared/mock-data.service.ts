import { Injectable } from '@angular/core';

import { Logger } from 'ngx-base';

import { cloneDeep } from 'lodash';
import { WorkItem } from '../models/work-item';

// mock data generators
import { SchemaMockGenerator } from './mock-data/schema-mock-generator';
import { WorkItemMockGenerator } from './mock-data/work-item-mock-generator';
import { UserMockGenerator } from './mock-data/user-mock-generator';
import { SpaceMockGenerator } from './mock-data/space-mock-generator';
import { AreaMockGenerator } from './mock-data/area-mock-generator';
import { IterationMockGenerator } from './mock-data/iteration-mock-generator';

/*
  This class provides a mock database store for entities. It provides
  CRUD operations on entities as well as some auxiliary methods, like users
  and identities.

  NOTE: IMPORTANT:
    if returning data to the http service, ALWAYS return vanity copies of
    objects, NOT THE LIVING REFERENCES TO STRUCTURES STORED HERE. As the 'real'
    networked service always returns detached object copies, this resembles the
    original behaviour. Also, the returnes references ARE RE-USED, so data could
    change without this class noticing it! THIS HAPPENS. IT HAPPENED. IT SUCKS!

  ANOTHER NOTE, ALSO IMPORTANT: 
    This is some sort of inmemory database. The whole thing relies on being a 
    singleton for the whole application. If you use this class, make sure there
    is only one instance in existence! If you have more than one instance of this,
    you will get weird errors, data values jumping around and you will have a fun
    time finding that problem. I did have a fun time finding that issue.
*/
@Injectable()
export class MockDataService {

  // mock data generators
  private schemaMockGenerator: SchemaMockGenerator = new SchemaMockGenerator();
  private workItemMockGenerator: WorkItemMockGenerator = new WorkItemMockGenerator();
  private userMockGenerator: UserMockGenerator = new UserMockGenerator();
  private spaceMockGenerator: SpaceMockGenerator = new SpaceMockGenerator();
  private iterationMockGenerator: IterationMockGenerator = new IterationMockGenerator();
  private areaMockGenerator: AreaMockGenerator = new AreaMockGenerator();

  // persistence store, the MockDataService is a singleton when injected as a service.
  private workItems: any[];
  private workItemLinks: any[];
  private workItemComments: any;
  private workItemChilds: any;
  private spaces: any[];
  private iterations: any[];
  private areas: any[];

  private selfId;

  constructor() {
    this.selfId = this.createId();
    // create initial data store
    this.workItems = this.workItemMockGenerator.createWorkItems();
    this.workItemLinks = this.workItemMockGenerator.createWorkItemLinks();
    this.workItemComments = this.workItemMockGenerator.createWorkItemComments();
    this.workItemChilds = this.workItemMockGenerator.createWorkItemChilds();
    this.spaces = this.spaceMockGenerator.createSpaces();
    this.iterations = this.iterationMockGenerator.createIterations();
    this.areas = this.areaMockGenerator.createAreas();

    this.selfId = this.createId();
    console.log('Started MockDataService service instance ' + this.selfId);
  }

  // utility methods

  createId(): string {
    let id = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 5; i++)
      id += possible.charAt(Math.floor(Math.random() * possible.length));
    console.log('Created new id ' + id);
    return id;
  }

  private makeCopy(input: any): any {
    return JSON.parse(JSON.stringify(input));
  }

  // data accessors

  // work items and dependend entities (comments, ..)

  /* Filter the workitems */
  public getWorkItemsFiltered(pathParams: any): any {

    let assigneeFilter = pathParams['filter[assignee]'];
    let workItemTypeFilter = pathParams['filter[workitemtype]'];
    let workItemStateFilter = pathParams['filter[workitemstate]'];
    let iterationFilter = pathParams['filter[iteration]'];

    console.log('Filtering on: '
      + (assigneeFilter ? 'assignee==' + assigneeFilter + ' ' : '')
      + (workItemTypeFilter ? 'workitemtype==' + workItemTypeFilter + ' ' : '')
      + (workItemStateFilter ? 'state==' + workItemStateFilter + ' ' : '')
      + (iterationFilter ? 'iteration==' + iterationFilter + ' ' : '')
    );

    var filteredWorkitems = new Array();
    var counter = 0;

    for (var i = 0; i < this.workItems.length; i++) {
      let filterMatches: boolean = true;
      if (assigneeFilter)
        filterMatches = filterMatches && (this.workItems[i].relationships.assignees.data && this.workItems[i].relationships.assignees.data[0].id === assigneeFilter);
      if (workItemTypeFilter)
        filterMatches = filterMatches && (this.workItems[i].relationships.baseType.data.id === workItemTypeFilter);
      if (workItemStateFilter)
        filterMatches = filterMatches && (this.workItems[i].attributes['system.state'] === workItemStateFilter);
      if (iterationFilter)
        filterMatches = filterMatches && this.workItems[i].relationships.iteration.data && (this.workItems[i].relationships.iteration.data.id === iterationFilter);

      if (filterMatches)
        filteredWorkitems.push(this.makeCopy(this.workItems[i]));
    }
    return filteredWorkitems;
  }

  public getWorkItems(): any {
    return this.makeCopy(this.workItems);
  }

  public createWorkItemOrEntity(extraPath: string, entity: any): any {
    if (extraPath && extraPath.indexOf('/') != -1) {
      // request for subentities on a wi
      var parts = extraPath.split('/');
      var wiId = parts[0];
      var subselect = parts[1];
      if (subselect === 'comments') {
        console.log('Request create new comment for workitem ' + wiId);
        var newId = this.createId();
        var newComment = {
              'attributes': {
                'body': entity.data.attributes.body,
                'created-at': '2000-01-01T09:00:00.000000Z'
              },
              'id': newId,
              'links': {
                'self': 'http://demo.api.almighty.io/api/comments/' + newId
              },
              'relationships': {
                'created-by': {
                  'data': {
                    'id': 'user0',
                    'type': 'identities'
                  }
                }
              },
              'type': 'comments'
        };
        if (this.workItemComments[wiId])
          this.workItemComments[wiId].data.push(newComment);
        else
          this.workItemComments[wiId] = { data: [ newComment ] };
        return { data: newComment };
      }
      return {};
    }
    var localWorkItem = this.makeCopy(entity.data);
    localWorkItem.id = this.createId();
    localWorkItem.links = {
          'self': 'http://mock.service/api/workitems/id' + localWorkItem.id,
          'sourceLinkTypes': 'http://mock.service/api/source-link-types',
          'targetLinkTypes': 'http://mock.service/api/target-link-types'
        };
    localWorkItem.relationships = {
          'assignees': { },
          'iteration': { },
          'area': { },
          'baseType': {
            'data': {
              'id': '86af5178-9b41-469b-9096-57e5155c3f31',
              'type': 'workitemtypes'
            }
          },
          'comments': {
            'links': {
              'related': 'http://mock.service/api/workitems/id' + localWorkItem.id + '/comments',
              'self': 'http://mock.service/api/workitems/id' + localWorkItem.id + '/relationships/comments'
            }
          },
          'creator': {
            'data': {
              'id': 'user0',
              'imageURL': 'https://avatars.githubusercontent.com/u/2410471?v=3',
              'links': {
                'self': 'http://mock.service/api/user'
              },
              'type': 'identities'
            }
          },
        };
    this.workItems.push(localWorkItem);
    return { data: this.makeCopy(localWorkItem) };
  }

  public getWorkItemOrEntity(extraPath: string): any {
    if (extraPath && extraPath.indexOf('/') != -1) {
      // request for subentities on a wi
      var parts = extraPath.split('/');
      var wiId = parts[0];
      var subselect = parts[1];
      if (subselect === 'comments') {
        console.log('Requested comments for workitem ' + wiId);
        if (this.workItemComments[wiId])
          return this.makeCopy(this.workItemComments[wiId]);
        return { data: [] };
      } else if (subselect === 'relationships') {
        console.log('Request for relationships for workitem ' + wiId);
        if (parts[2] === 'links') {
          var links = this.getWorkItemLinksForWorkItem(wiId);
          let linkIncludes: any[] = [];
          links.forEach((link: any) => linkIncludes = linkIncludes.concat(this.createWorkItemLinkIncludes(link)));
          return {
            data: links,
            meta: { totalCount: links.length },
            included: linkIncludes
          };
        }
      } else if (subselect === 'childs') {
        console.log('Request for childs for workitem ' + wiId);
        return {
            data: this.makeCopy(this.workItemChilds[wiId])
          };
      }
      // should never happen
      return {};
    }
    console.log('Requested workitem ' + extraPath);
    for (var i = 0; i < this.workItems.length; i++)
      if (this.workItems[i].id === extraPath) {
        return { data: this.makeCopy(this.workItems[i]) };
      }
  };

  public updateWorkItem(workItem: any): any {
    var localWorkItem = cloneDeep(workItem);
    for (var i = 0; i < this.workItems.length; i++) {
      if (this.workItems[i].id === localWorkItem.id) {
        // Some relationship update
        if (workItem.relationships) {
          // Iteration update
          if (workItem.relationships.iteration.data) {
            console.log('WorkItem has updated iteration field: ' + this.workItems[i].id + ' old: ' + JSON.stringify(workItem.relationships.iteration.data) + ' new: ' + JSON.stringify(workItem.relationships.iteration.data));
            this.workItems[i].relationships.iteration = { data: {
              id: workItem.relationships.iteration.data.id,
              links: { self: 'http://mock.service/api/iterations/' + workItem.relationships.iteration.data.id },
              type: 'iterations'
            }};
          } else {
            this.workItems[i].relationships.iteration = { };
          }
          // Area update
          if (workItem.relationships.area && workItem.relationships.area.data) {
            this.workItems[i].relationships.area = { data: {
              id: workItem.relationships.area.data.id,
              links: { self: 'http://mock.service/api/areas/' + workItem.relationships.area.data.id },
              type: 'areas'
            }};
          } else {
            this.workItems[i].relationships.area = { };
          }
          // Assignee update
          if (workItem.relationships.assignees && workItem.relationships.assignees.data) {
            if (workItem.relationships.assignees.data.length) {
              this.workItems[i].relationships.assignees.data = workItem.relationships.assignees.data.map((assignee) => {
                return this.getUserById(assignee.id);
              });
            } else {
              this.workItems[i].relationships.assignees = {};
            }
          }
        } else {
          Object.assign(this.workItems[i].attributes, localWorkItem.attributes);
        }
        return cloneDeep(this.workItems[i]);
      }
    }
    return null;
  }

  public deleteWorkItem(id: string): boolean {
    for (var i = 0; i < this.workItems.length; i++)
      if (this.workItems[i].id === id) {
        this.workItems.splice(i, 1);
        return true;
      }
      return false;
  }

  public searchWorkItem(term: string): boolean {
    for (var i = 0; i < this.workItems.length; i++)
      if (this.workItems[i].fields['system.title'].indexOf(term) != -1) {
        return this.makeCopy(this.workItems[i]);
      }
    return false;
  }

  // work item links

  public getWorkItemLinks(): any {
    return this.makeCopy(this.workItemLinks);
  }

  public getWorkItemLinksForWorkItem(workItemId: string): any {
    var result: any = [];
    for (var i = 0; i < this.workItemLinks.length; i++) {
      if (this.workItemLinks[i].relationships.source.data.id === workItemId ||
          this.workItemLinks[i].relationships.target.data.id === workItemId) {
        result.push(this.makeCopy(this.workItemLinks[i]));
      }
    }
    return result;
  }

  public createWorkItemLink(workItemLink: any): any {
    var localWorkItemLink = this.makeCopy(workItemLink);
    localWorkItemLink.id = this.createId();
    this.workItemLinks.push(localWorkItemLink);
    return this.makeCopy(localWorkItemLink);
  }

  public createWorkItemLinkIncludes(workItemLink: any): any {
    let localWorkItemLink = this.makeCopy(workItemLink);
    let workItems = this.getWorkItems();
    let workItem_1 = workItems.find((i: any) => i.id == localWorkItemLink.relationships.source.data.id);
    let workItem_2 = workItems.find((i: any) => i.id == localWorkItemLink.relationships.target.data.id);
    let wiLinkType = this.getWorkItemLinkTypes().data.find((i: any) => i.id == localWorkItemLink.relationships.link_type.data.id);
    return [this.makeCopy(workItem_1), this.makeCopy(workItem_2), this.makeCopy(wiLinkType)];
  }

  public updateWorkItemLink(workItemLink: any): any {
    var localWorkItemLink = this.makeCopy(workItemLink);
    for (var i = 0; i < this.workItemLinks.length; i++)
      if (this.workItemLinks[i].id === localWorkItemLink.id) {
        this.workItemLinks.splice(i, 1, localWorkItemLink);
        return this.makeCopy(localWorkItemLink);
      }
    return null;
  }

  public deleteWorkItemLink(id: string): boolean {
    for (var i = 0; i < this.workItemLinks.length; i++)
      if (this.workItemLinks[i].id === id) {
        this.workItemLinks.splice(i, 1);
        return true;
      }
    return false;
  }

  // user and identities

  public getUser(): any {
    return this.userMockGenerator.getUser();
  }

  public getUserById(id: string): any {
    return this.userMockGenerator.getAllUsers().find(u => u.id === id);
  }

  public getAllUsers(): any {
    return this.userMockGenerator.getAllUsers();
  }

  public getLoginStatus() {
    return {
      'status': 200,
      'responseText': 'Good Job'
    };
  }

  // spaces
  public getAllSpaces(): any {
    return this.spaces;
  }

  //areas
  public getAllAreas(): any {
    console.log('Area - ', this.areas);
    return this.areas;
  }

  public getArea(id: string): any {
    return this.areas.find(a => a.id === id);
  }

  // iterations
  private updateWorkItemCountsOnIteration() {
    console.log('Updating work item counts on service side.');
    for (var i = 0; i < this.iterations.length; i++) {
      let thisIteration = this.iterations[i];
      thisIteration.relationships.workitems.meta.total = 0;
      thisIteration.relationships.workitems.meta.closed = 0;
      // get correct work item count for iteration
      if (thisIteration.attributes.parent_path === '/') {
        // root iteration, meta count will be all of workitems
        thisIteration.relationships.workitems.meta.total = this.workItems.length;
        for (var j = 0; j < this.workItems.length; j++) {
          if (this.workItems[j].attributes['system.state']==='closed')
            thisIteration.relationships.workitems.meta.closed++;
        }          
        console.log('Got count for root iteration: ' + thisIteration.relationships.workitems.meta.total);
      } else {
        // standard iteration
        for (var j = 0; j < this.workItems.length; j++) {
          if (this.workItems[j].relationships.iteration.data && this.workItems[j].relationships.iteration.data.id === thisIteration.id) {
            thisIteration.relationships.workitems.meta.total++;
            if (this.workItems[j].attributes['system.state']==='closed')
              thisIteration.relationships.workitems.meta.closed++;
          }
        }
        console.log('Got count for standard iteration: ' + thisIteration.relationships.workitems.meta.total + ' iteration id ' + thisIteration.id);
      }
    }
  }

  public getAllIterations(): any {
    this.updateWorkItemCountsOnIteration();
    return this.makeCopy(this.iterations);
  }

  public getIteration(id: string): any {
    this.updateWorkItemCountsOnIteration();
    for (var i = 0; i < this.iterations.length; i++)
      if (this.iterations[i].id === id) {
        return this.makeCopy(this.iterations[i]);
      }
    return null;
  }

  public createIteration(iteration: any): any {
    var localIteration = this.makeCopy(iteration.data);
    localIteration.id = this.createId();
    if (!localIteration.attributes.hasOwnProperty('state') && !localIteration.attributes.state) {
      localIteration.attributes['state'] = 'new';
    }
    return this.makeCopy(localIteration);
  }

   public updateIteration(iteration: any): any {
    var localIteration = this.makeCopy(iteration.data);
    for (var i = 0; i < this.iterations.length; i++)
      if (this.iterations[i].id === localIteration.id) {
        // TODO: we might have to do a proper merge of the values at some point.
        if (!localIteration.attributes.hasOwnProperty('state') || !localIteration.attributes.state) {
          localIteration.attributes['state'] = this.iterations[i].attributes['state'];
        }
        this.iterations.splice(i, 1, localIteration);
        return this.makeCopy(localIteration);
      }
    return null;
  }

  public deleteIteration(id: string): boolean {
    for (var i = 0; i < this.iterations.length; i++)
      if (this.iterations[i].id === id) {
        this.iterations.splice(i, 1);
        return true;
      }
    return false;
  }

  // schemas

  public getWorkItemTypes(): any {
    return this.schemaMockGenerator.getWorkItemTypes();
  }

  public getWorkItemTypeById(id: string): any {
    return this.schemaMockGenerator.getWorkItemTypeById(id);
  }

  public getWorkItemLinkTypes(): any {
    return this.schemaMockGenerator.getWorkItemLinkTypes();
  }

  public getRedneredText(data: any): any {
    return this.schemaMockGenerator.renderText(data.attributes.content);
  }
}
