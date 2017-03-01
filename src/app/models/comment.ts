import { User } from 'ngx-login-client';

export class Comment {
    id: string;
    type: string;
    attributes: CommentAttributes;
    relationships: {
        'created-by': {
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
