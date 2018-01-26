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

  uiToServiceMapTree: MapTree = [];

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
