import { Injectable } from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { AuthenticationService } from '../../../../auth/authentication.service';
import { Logger } from '../../../../shared/logger.service';
import { LinkType } from '../../../../models/link-type';
import { Link } from '../../../../models/link';


@Injectable()
export class WorkItemLinkService {
  private headers = new Headers({'Content-Type': 'application/vnd.api+json'});
  // Fetching link category of system for now (To be refactored after full implementation)
  private linkCategoryUrl = process.env.API_URL + 'workitemlinkcategories';
  private linkTypesUrl = process.env.API_URL + 'workitemlinktypes';
  private linksUrl = process.env.API_URL + 'workitemlinks';
  linkTypes: LinkType[];

  constructor(private http: Http,
              private logger: Logger,
              private auth: AuthenticationService) {    
    if (this.auth.getToken() != null) {
      this.headers.set('Authorization', 'Bearer ' + this.auth.getToken());
    }
    logger.log('WorkItemLinkService running in ' + process.env.ENV + ' mode.');
  }

  getLinkTypes(): Promise<LinkType[]> {
    if (this.linkTypes){
      return new Promise( (resolve, reject) => {
        resolve(this.linkTypes);
      });
    } else {
      return this.http
        .get(this.linkTypesUrl, {headers: this.headers})
        .toPromise()
        .then(response => {
          this.linkTypes = response.json().data as LinkType[];
          return this.linkTypes;
        }).catch(this.handleError);
    } 
  }

  getAllLinks(): Promise<Link[]> {
    return this.http
      .get(this.linksUrl, {headers: this.headers})
      .toPromise()
      .then(response => response.json().data as Link[])
      .catch(this.handleError);
  }

  createLink(link: Object): Promise<Link> {
  // createLink(link: Object): Promise<any> {
    return this.http
      .post(this.linksUrl, JSON.stringify(link), {headers: this.headers})
      .toPromise()
      .then(response => response.json().data as Link)
      .catch(this.handleError);


    /* Workitem link type 
   const tempData = {
      "data": {
        "attributes": {
          "description": "A test work item can 'test' if a the code in a pull request passes the tests.",
          "forward_name": "story-story",
          "name": "story-story",
          "reverse_name": "story by",
          "topology": "network", 
          "version": 0
        },
        // "id": "40bbdd3d-8b5d-4fd6-ac90-7236b669af04",
        "relationships": {
          "link_category": {
            "data": {
              "id": "c08d244f-ca36-4943-b12c-1cdab3525f12",
              "type": "workitemlinkcategories"
            }
          },
          "source_type": {
            "data": {
              "id": "system.userstory",
              "type": "workitemtypes"
            }
          },
          "target_type": {
            "data": {
              "id": "system.userstory",
              "type": "workitemtypes"
            }
          }
        },
        "type": "workitemlinktypes"
      }
    };
    return this.http
      .post(this.linkTypesUrl, JSON.stringify(tempData), {headers: this.headers})
      .toPromise()
      .then(response => console.log(response))
      .catch(this.handleError); */


/*Workitem link category *
  const tempData = {
    "data": {
      "attributes": {
        "description": "A work item link category that is meant only for work item link types goverened by the system alone.",
        "name": "system",
        "version": 0
      },
      "id": "6c5610be-30b2-4880-9fec-81e4f8e4fd76",
      "type": "workitemlinkcategories"
    }
  };
  return this.http
      .post(this.linkCategoryUrl, JSON.stringify(tempData), {headers: this.headers})
      .toPromise()
      .then(response => console.log(response))
      .catch(this.handleError);  */
  }

  // deleteLink(link: Link): Promise<void> {
  deleteLink(link: any): Promise<void> {
    const url = `${this.linksUrl}/${link.id}`;
    return this.http
      .delete(url, {headers: this.headers})
      .toPromise()
      .then(response => { console.log(response); })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

}