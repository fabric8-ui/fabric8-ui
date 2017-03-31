/*
 * This class contains mock generator code for users, identities
 * and all depended entities.
 */
export class UserMockGenerator {

  // the user and identites are static data (for now), so we cache it here.
  private user: any;
  private allusers: any;

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
  public getAllUsers(): any {
    if (this.allusers)
      return this.allusers;
    else {
      this.allusers = [0, 1, 2, 3].map((i) => {
        return {
          attributes: {
            fullName: 'Example User ' + i,
            imageURL: 'https://avatars.githubusercontent.com/u/241047' + (i + 1) + '?v=3',
            email: 'example' + i + '@email.exmp',
            bio: '',
            provider: 'kc2',
            url: '',
            username: 'example' + i
          },
          links: {
            self: 'http://mock.service/api/user/user' + i
          },
          id: 'user' + i,
          type: 'identities'
        };
      });
      return this.allusers;
    }
  }

}
