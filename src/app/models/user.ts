import { Entity } from './entity';

export class User implements Entity {
  attributes: {
    fullName: string;
    imageURL: string;
    email?: string;
    bio?: string;
    username?: string;
    url?: string;
    publicEmail?: boolean;
  };
  id: string;
  type: string;
}
