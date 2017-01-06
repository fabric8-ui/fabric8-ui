import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProfileService } from './../../profile/profile.service';
import { Email } from './../../models/email';

@Component({
  selector: 'alm-settingsOverview',
  templateUrl: 'emails.component.html',
  styleUrls: ['./emails.component.scss']
})
export class EmailsComponent {

  email: string;
  keepPrivate: boolean;

  constructor(
    private router: Router, public profile: ProfileService) {
  }

  del(del: Email): void {
    this.profile.removeEmailFromCurrent(del);
    this.profile.save();
  }

  add() {
    let add: Email = {
      address: this.email,
      keepPrivate: this.keepPrivate
    } as Email;
    this.profile.current.emails.push(add);
    this.profile.save();
  }

  makePrimary(primary: Email): void {
    this.profile.current.primaryEmail = primary;
  }

  savePreferences(): void {
    this.profile.save();
  }

}
