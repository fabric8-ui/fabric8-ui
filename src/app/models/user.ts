import {
  modelUI,
  Mapper,
  MapTree,
  switchModel
} from './common.model';
import { User } from 'ngx-login-client';

export interface UserUI extends modelUI {
  avatar: string;
  username: string;
}

export interface UserService extends User {}

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
