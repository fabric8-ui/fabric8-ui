import { Injectable, Component, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User, UserService } from 'ngx-login-client';
import { Spaces } from 'ngx-fabric8-wit';
import { Logger } from 'ngx-base';
import { HttpService } from './http-service';


@Injectable()
export class CollaboratorService {
  constructor(private http: HttpService,
  private logger: Logger,
  private spaces: Spaces,
  private userService: UserService) {

  }

  getCollaborators(): Observable<User[]> {
    return this.spaces.current.switchMap((space) => {
      // FIXME: https://github.com/fabric8-ui/ngx-fabric8-wit/issues/82
      if (space) {
        return this.http.get(space.links.self + '/collaborators?page[offset]=0&page[limit]=1000')
          .map(resp => resp.json().data as User[]);
      } else {
        return Observable.of([] as User[]);
      }
    });
  }

  getCollaborators2(url: string): Observable<User[]> {
    return this.http.get(url)
      .map(resp => resp.json().data as User[]);
  }
}
