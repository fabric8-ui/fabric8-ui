import { Injectable } from '@angular/core';
import {
  UserService as UserServiceClass
} from 'ngx-login-client';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { SpaceQuery } from './space';
import { UserQuery } from './user';

@Injectable()
export class PermissionQuery {
  constructor(
    private userQuery: UserQuery,
    private spaceQuery: SpaceQuery,
    private userService: UserServiceClass
  ) {}

  isAllowedToAdd(): Observable<boolean> {
    return this.spaceQuery.getCurrentSpace
    .pipe(
      switchMap((space) => {
        return this.userService.loggedInUser.pipe(map(user => {
          return {spaceName: space.attributes.name, user: user};
        }));
      }),
      switchMap(spaceAndUser => {
        return this.userQuery.getCollaboratorIds.pipe(
          map(collaboratorIDs => {
            if (spaceAndUser.user.id) {
              if (collaboratorIDs.indexOf(spaceAndUser.user.id) >= 0) {
                return false;
              } else {
                return !(spaceAndUser.spaceName === 'Openshift_io');
              }
            }
          })
        );
      })
    );
  }
}
