import { NewUser } from '../user/user';

export class Comment {
    id: string;
    type: string;
    attributes: CommentAttributes;
    relationships: {
        'created-by': {
            data: NewUser;
        }
    };
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
