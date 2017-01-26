import { Logger } from './../shared/logger.service';

import { Injectable } from '@angular/core';
import { WorkItem } from '../work-item/work-item';

// mock data generators
import { SchemaMockGenerator } from './mock-data/schema-mock-generator';
import { WorkItemMockGenerator } from './mock-data/work-item-mock-generator';
import { UserMockGenerator } from './mock-data/user-mock-generator';
import { SpaceMockGenerator } from './mock-data/space-mock-generator';
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
*/
@Injectable()
export class MockDataService {

  // mock data generators
  private schemaMockGenerator: SchemaMockGenerator = new SchemaMockGenerator();
  private workItemMockGenerator: WorkItemMockGenerator = new WorkItemMockGenerator();
  private userMockGenerator: UserMockGenerator = new UserMockGenerator();
  private spaceMockGenerator: SpaceMockGenerator = new SpaceMockGenerator();
  private iterationMockGenerator: IterationMockGenerator = new IterationMockGenerator();

  // persistence store, the MockDataService is a singleton when injected as a service.
  private workItems: any[];
  private workItemLinks: any[];
  private workItemComments: any;
  private spaces: any[];
  private iterations: any[];

  constructor() {
    // create initial data store
    this.workItems = this.workItemMockGenerator.createWorkItems();
    this.workItemLinks = this.workItemMockGenerator.createWorkItemLinks();
    this.workItemComments = this.workItemMockGenerator.createWorkItemComments();
    this.spaces = this.spaceMockGenerator.createSpaces();
    this.iterations = this.iterationMockGenerator.createIterations();
  }

  // utility methods

  private createId(): string {
    var id = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i = 0; i < 5; i++)
      id += possible.charAt(Math.floor(Math.random() * possible.length));
    console.log('Created new id ' + id);
    return id;
  }

  private makeCopy(input: any): any {
    return JSON.parse(JSON.stringify(input));
  }

  // data accessors

  // work items and dependend entities (comments, ..)

  /* Filter the workitems based on assignee */
  public getWorkItemsFiltered(theAssignee: string): any {
    console.log ("The assignee on which to filter is: " + theAssignee);
    var filteredWorkitems = new Array (25);
    var counter = 0;

    for (var i = 0; i < this.workItems.length; i++) {
       if (this.workItems[i].relationships.assignees.data) {
         console.log ("The assignee on which to filter is is: " + this.workItems[i].relationships.assignees.data[0].id);
         filteredWorkitems[counter++] = this.makeCopy(this.workItems[i]);
      }
    }
    var returnArray = new Array (counter-1);
    for (var i = 0; i < counter; i++) {
      returnArray[i] = this.makeCopy(filteredWorkitems[i]);
    }
    return this.makeCopy(returnArray);
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
          'self': 'http://mock.service/api/workitems/id' + localWorkItem.id
        };
    localWorkItem.relationships = {
          'assignees': { },
          'baseType': {
            'data': {
              'id': 'userstory',
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
              'links': {
                'self': 'http://mock.service/api/users/some-creator-id'
              },
              'type': 'identities'
            }
          }
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
      }
      // should never happen
      return {};
    }
    console.log('Requested workitem ' + extraPath);
    for (var i = 0; i < this.workItems.length; i++)
      if (this.workItems[i].id === extraPath)
        return { data: this.makeCopy(this.workItems[i]) };
  };

  public updateWorkItem(workItem: any): any {
    var localWorkItem = this.makeCopy(workItem);
    for (var i = 0; i < this.workItems.length; i++)
      if (this.workItems[i].id === localWorkItem.id) {
        this.workItems.splice(i, 1, localWorkItem);
        return this.makeCopy(localWorkItem);
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

  // iterations

  public getAllIterations(): any {
    return this.iterations;
  }

  public getIteration(id: string): any {
    for (var i = 0; i < this.iterations.length; i++)
      if (this.iterations[i].id === id) {
        return this.iterations[i];
      }
    return null;
  }

  public createIteration(iteration: any): any {
    var localIteration = this.makeCopy(iteration);
    localIteration.id = this.createId();
    this.iterations.push(localIteration);
    return this.makeCopy(localIteration);
  }

  public updateIteration(iteration: any): any {
    var localIteration = this.makeCopy(iteration);
    for (var i = 0; i < this.iterations.length; i++)
      if (this.iterations[i].id === localIteration.id) {
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

  public getWorkItemLinkTypes(): any {
    return this.schemaMockGenerator.getWorkItemLinkTypes();
  }

  public getRedneredText(data: any): any {
    return this.schemaMockGenerator.renderText(data.attributes.content);
  }
}
