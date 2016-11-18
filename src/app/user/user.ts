export class User {
  id: string;
  fullName: string;
  imageURL: string;
}

export class NewUser {
  attributes: {
    fullName: string;
    imageURL: string;
  };
  id: string;
  type: string;
}