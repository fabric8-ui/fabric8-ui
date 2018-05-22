import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { User, Profile } from 'ngx-login-client';
import { AppState } from './../states/app.state';
import {
  modelUI,
  modelService,
  Mapper,
  MapTree,
  switchModel
} from './common.model';
import { Get as GetUserAction } from './../actions/user.actions';



export interface UserService extends modelService {
  attributes?: Profile;
  links?: {
    self?: string;
    related?: string;
  }
}

export interface UserUI extends modelUI {
  avatar: string;
  username: string;
  currentUser: boolean;
}

@Injectable()
export class UserMapper implements Mapper<UserService, UserUI> {

  serviceToUiMapTree: MapTree = [{
    fromPath: ['id'],
    toPath: ['id']
  }, {
    fromPath: ['attributes', 'fullName'],
    toPath: ['name']
  }, {
    fromPath: ['attributes', 'imageURL'],
    toPath: ['avatar']
  }, {
    fromPath: ['attributes', 'username'],
    toPath: ['username']
  }, {
    toPath: ['currentUser'],
    toValue: false
  }];

  uiToServiceMapTree: MapTree = [{
    toPath: ['id'],
    fromPath: ['id']
  }, {
    toPath: ['attributes', 'fullName'],
    fromPath: ['name']
  }, {
    toPath: ['attributes', 'imageURL'],
    fromPath: ['avatar']
  }, {
    toPath: ['attributes', 'username'],
    fromPath: ['username']
  }, {
    toPath: ['type'],
    toValue: 'identities'
  }];

  toUIModel(arg: UserService): UserUI {
    return switchModel<UserService, UserUI> (
      arg, this.serviceToUiMapTree
    )
  }

  toServiceModel(arg: UserUI): UserService {
    return switchModel<UserUI, UserService> (
      arg, this.uiToServiceMapTree
    )
  }
}

@Injectable()
export class UserQuery {
  store: Store<AppState>;
  constructor(store: Store<AppState>) {
    this.store = store;
  }

  getUserObservableById(id: string): Observable<UserUI> {
    return this.store.select('listPage')
      .select('users').select(users => users[id])
      // If the desired user doesn't exist then fetch it
      .do(user => {
        if(!user) {
          this.store.dispatch(new GetUserAction(id))
        }
      })
      // filter the pipe based on availability of the user
      .filter(user => !!user);
  }
}
