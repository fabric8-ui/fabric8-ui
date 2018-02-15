import { User } from 'ngx-login-client';
import { UserUI, UserMapper } from './user';
import {
  Mapper,
  MapTree,
  switchModel,
  modelService
} from './common.model';

export class Comment extends modelService {
    attributes: CommentAttributes;
    relationships: {
        'created-by': {
            data: {
              id: string;
              type: string;
            };
        },
        'creator': {
          data: {
            id: string;
            type: string;
          };
      }
    };
    links: CommentLink;
    relationalData?: RelationalData;
}

export class CommentLink {
    self: string;
}

export class CommentAttributes {
    body: string;
    'body.rendered': string;
    'markup': string;
    'created-at': string;
}

export class Comments {
    data: Comment[];
}

export class CommentPost {
    data: Comment;
}

export class RelationalData {
  creator?: User;
}

export interface CommentUI {
  id: string;
  body: string;
  markup: string;
  createdAt: string;
  creator: UserUI;
  bodyRendered: string;
}

export interface CommentService extends Comment {}

export class CommentMapper implements Mapper<CommentService, CommentUI> {
  constructor(private userMapper: UserMapper) {
    this.userMapper = userMapper
  }

  serviceToUiMapTree: MapTree = [{
    fromPath: ['id'],
    toPath: ['id']
  }, {
    fromPath: ['attributes', 'body'],
    toPath: ['body']
  }, {
    fromPath: ['attributes', 'markup'],
    toPath: ['markup']
  }, {
    fromPath: ['attributes', 'created-at'],
    toPath: ['createdAt']
  }, {
    fromPath: ['relationships', 'created-by', 'data'],
    toPath: ['creator']
  }, {
    fromPath: ['attributes', 'body.rendered'],
    toPath: ['bodyRendered']
  }, {
    fromPath: ['relationships', 'creator', 'data'],
    toPath: ['creator'],
    toFunction: this.userMapper.toUIModel.bind(this.userMapper)
  }];

  uiToServiceMapTree: MapTree = [{
    toPath: ['id'],
    fromPath: ['id']
  }, {
    toPath: ['attributes', 'body'],
    fromPath: ['body']
  }, {
    toPath: ['attributes', 'markup'],
    fromPath: ['markup']
  }, {
    toPath: ['attributes', 'created-at'],
    fromPath: ['createdAt']
  }, {
    toPath: ['relationships', 'created-by', 'data'],
    fromPath: ['creator']
  }, {
    toPath: ['attributes', 'body.rendered'],
    fromPath: ['bodyRendered']
  }, {
    toPath: ['type'],
    toValue: 'comments'
  }];

  toUIModel(arg: CommentService): CommentUI {
    return switchModel<CommentService, CommentUI>(
      arg, this.serviceToUiMapTree
    )
  }

  toServiceModel(arg: CommentUI): CommentService {
    return switchModel<CommentUI, CommentService>(
      arg, this.uiToServiceMapTree
    )
  }
}
