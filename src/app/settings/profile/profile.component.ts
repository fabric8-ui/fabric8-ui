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

  constructor(
    private router: Router,
    public profile: ProfileService,
    private broadcaster: Broadcaster
  ) {
  }

  ngOnInit() {
  }

  save() {
    this.profile.save();
  }

}
