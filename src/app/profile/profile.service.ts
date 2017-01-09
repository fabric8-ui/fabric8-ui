import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { DummyService } from './../dummy/dummy.service';
import { Broadcaster } from '../shared/broadcaster.service';
import { Profile } from './../models/profile';
import { User } from './../models/user';


/*
 * A service that manages the users profile
 *
 */
@Injectable()
export class ProfileService {

  constructor(
    private dummy: DummyService,
    private router: Router,
    private broadcaster: Broadcaster
  ) {
  }

  get current(): Profile {
    // TODO Remove dummy
    if (this.dummy.currentUser) {
      return this.dummy.currentUser.attributes;
    }
  }

  save() {
    this.addPrimaryToEmails();
    // TODO Remove dummy
    this.broadcaster.broadcast('save');
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

  checkProfileSufficient(): boolean {
    if (this.current &&
      this.current.fullName &&
      this.current.primaryEmail &&
      this.current.username
      /* TODO Add imageURL
      this.current.imageURL
      */
      ) {
      return true;
    } else {
      return false;
    }
  }

  initDefaults() {
    this.current.emails = this.current.emails || [] as string[];
    this.current.primaryEmail = this.current.primaryEmail || '';
    this.current.notificationEmail = this.current.notificationEmail || this.current.primaryEmail;
    this.current.publicEmail = this.current.publicEmail || this.current.primaryEmail;
    this.current.emailPreference = this.current.emailPreference || 'all';
    this.current.notificationMethods = this.current.notificationMethods || [] as string[];
    this.addPrimaryToEmails();
  }

  private addPrimaryToEmails() {
    if (this.current.primaryEmail && this.current.primaryEmail) {
      for (let e of this.current.emails) {
        if (e === this.current.primaryEmail) {
          return;
        }
      }
      this.current.emails.unshift(this.current.primaryEmail);
    }
  }

}
