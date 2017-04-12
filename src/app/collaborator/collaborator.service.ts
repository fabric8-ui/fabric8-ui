import { Injectable, Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User, UserService } from 'ngx-login-client';
import { Spaces } from 'ngx-fabric8-wit';
import { Logger } from 'ngx-base';
import { HttpService } from './../shared/http-service';


@Injectable()
export class CollaboratorService {
  constructor(private http: HttpService,
  private logger: Logger,
  private spaces: Spaces,
  private userService: UserService) {

  }

  getCollaborators(): Observable<User[]> {
    return this.spaces.current.switchMap((space) => {
      // This if section is temporary
      if (space.attributes.name === 'system.space') {
        return this.userService.getAllUsers();
      }
      return this.http.get(space.links.self + '/collaborators')
        .map(resp => resp.json().data as User[]);
    });
  }
}
