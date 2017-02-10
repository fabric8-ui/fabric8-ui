export class User {
  attributes: {
    fullName: string;
    imageURL: string;
    email: string;
    bio: string;
    provider: string;
    url: string;
    username: string;
  };
  links: {
    self: string;
  };
  id: string;
  type: string;
}
