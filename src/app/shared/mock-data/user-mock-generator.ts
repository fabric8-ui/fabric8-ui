/*
 * This class contains mock generator code for users, identities
 * and all depended entities.
 */
export class UserMockGenerator {

  // the user and identites are static data (for now), so we cache it here.
  private user: any;
  private identities: any;

  /*
   * Creates the logged in user structure.
   */
  public getUser(): any {
    if (this.user)
      return this.user;
    else {
      this.user = {
        attributes: {
          fullName: 'Example User 0',
          imageURL: 'https://avatars.githubusercontent.com/u/2410471?v=3'
        },
        id: 'user0',
        type: 'identities'
      };
      return this.user;
    }
  }

  /*
   * Creates the identities structure.
   */
  public getIdentities(): any {
    if (this.identities)
      return this.identities;
    else {
      this.identities = [
        {
          attributes: {
            fullName: 'Example User 0',
            imageURL: 'https://avatars.githubusercontent.com/u/2410471?v=3'
          },
          id: 'user0',
          type: 'identities'
        }, {
          attributes: {
            fullName: 'Example User 1',
            imageURL: 'https://avatars.githubusercontent.com/u/2410472?v=3'
          },
          id: 'user1',
          type: 'identities'
        }, {
          attributes: {
            fullName: 'Example User 2',
            imageURL: 'https://avatars.githubusercontent.com/u/2410473?v=3'
          },
          id: 'user2',
          type: 'identities'
        }, {
          attributes: {
            fullName: 'Example User 3',
            imageURL: 'https://avatars.githubusercontent.com/u/2410474?v=3'
          },
          id: 'user3',
          type: 'identities'
        }
      ];
      return this.identities;
    }
  }

}