import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { DummyService } from './../dummy/dummy.service';
import { Broadcaster } from '../shared/broadcaster.service';
import { Profile } from './../models/profile';
import { Email } from './../models/email';


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
    this.init();
  }

  get current(): Profile {
    // TODO Remove dummy
    return this.dummy.currentUser.attributes;
  }

  save() {
    this.addPrimaryToEmails();
    // TODO Remove dummy
    this.broadcaster.broadcast('save');
  }

  removeEmailFromCurrent(del: Email) {
    for (let i: number = this.current.emails.length - 1; i >= 0; i--) {
      if (this.current.emails[i].address === del.address) {
        this.current.emails.splice(i, 1);
      }
    }
    if (this.current.primaryEmail.address === del.address) {
      this.current.primaryEmail = {} as Email;
    }
  }

  private init() {
    this.current.emails = this.current.emails || [] as Email[];
    this.current.primaryEmail = this.current.primaryEmail || {} as Email;
    this.current.emailPreference = this.current.emailPreference || 'all';
    this.current.notificationMethods = this.current.notificationMethods || [] as string[];
    this.addPrimaryToEmails();
  }

  private addPrimaryToEmails() {
    if (this.current.primaryEmail && this.current.primaryEmail.address) {
      for (let e of this.current.emails) {
        if (e.address === this.current.primaryEmail.address) {
          return;
        }
      }
      this.current.emails.unshift(this.current.primaryEmail);
    }
  }

}
