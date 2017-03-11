import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster, Profile, User, UserService } from 'ngx-login-client';

import { DummyService } from './../shared/dummy.service';


/*
 * A service that manages the users profile
 *
 */
@Injectable()
export class ProfileService {

  private _loggedInUser: User;

  constructor(
    private dummy: DummyService,
    private router: Router,
    private broadcaster: Broadcaster,
    userService: UserService
  ) {
    userService.loggedInUser.subscribe(val => this._loggedInUser = val);
  }

  get current(): Profile {
    return this._loggedInUser.attributes;
  }

  save() {
    this.addPrimaryToEmails(this.current);
    // TODO Save this!
  }

  removeEmailFromCurrent(del: string) {
    for (let i: number = this.current.emails.length - 1; i >= 0; i--) {
      if (this.current.emails[i] === del) {
        this.current.emails.splice(i, 1);
      }
    }
    if (del === this.current.publicEmail) {
      this.current.publicEmail = this.current.primaryEmail;
    }
    if (del === this.current.notificationEmail) {
      this.current.notificationEmail = this.current.primaryEmail;
    }
  }

  get sufficient(): boolean {
    if (this.current &&
      this.current.fullName &&
      this.current.primaryEmail &&
      this.current.username
      // TODO Add imageURL
      //this.current.imageURL
    ) {
      return true;
    } else {
      return false;
    }
  }

  initDefaults(user: User) {
    user.attributes.emails = user.attributes.emails || [] as string[];
    user.attributes.primaryEmail = user.attributes.primaryEmail || user.attributes.email;
    user.attributes.notificationEmail = user.attributes.notificationEmail || user.attributes.primaryEmail;
    user.attributes.publicEmail = user.attributes.publicEmail || user.attributes.primaryEmail;
    user.attributes.emailPreference = user.attributes.emailPreference || 'all';
    user.attributes.notificationMethods = user.attributes.notificationMethods || [] as string[];
    user.attributes.username = user.attributes.username || user.attributes.email;
    this.addPrimaryToEmails(user.attributes);
    this.broadcaster.broadcast('save');
  }

  private addPrimaryToEmails(profile: Profile) {
    if (profile.primaryEmail && profile.primaryEmail) {
      for (let e of profile.emails) {
        if (e === profile.primaryEmail) {
          return;
        }
      }
      profile.emails.unshift(profile.primaryEmail);
    }
  }

}
