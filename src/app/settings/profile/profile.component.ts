import { Broadcaster } from './../../shared/broadcaster.service';
import { ProfileService } from './../../profile/profile.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'alm-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public publicEmail: string = '';

  constructor(
    private router: Router,
    public profile: ProfileService,
    private broadcaster: Broadcaster
  ) {
  }

  ngOnInit() {
    if (!this.profile.current.primaryEmail.keepPrivate) {
      this.publicEmail = this.profile.current.primaryEmail.address;
    }
  }

  save() {
    if (this.publicEmail === '') {
      this.profile.current.primaryEmail.keepPrivate = true;
    } else {
      this.profile.current.primaryEmail.keepPrivate = false;
      this.profile.current.primaryEmail.address = this.publicEmail;
    }
    this.profile.save();
  }

}
