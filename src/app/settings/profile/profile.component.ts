import { Broadcaster } from './../../shared/broadcaster.service';
import { DummyService } from './../../dummy/dummy.service';
import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'alm-profile',
  templateUrl: 'profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  public publicEmail: string = '';

  constructor(
    private router: Router,
    public dummy: DummyService,
    private broadcaster: Broadcaster
    ) {
  }

  ngOnInit() {
    if (this.dummy.currentUser.attributes.publicEmail) {
      this.publicEmail = this.dummy.currentUser.attributes.email;
    }
  }

  save() {
    if (this.publicEmail === '') {
      this.dummy.currentUser.attributes.publicEmail = false;
    } else {
      this.dummy.currentUser.attributes.publicEmail = true;
      this.dummy.currentUser.attributes.email = this.publicEmail;
    }
    this.broadcaster.broadcast('save');
  }

}
