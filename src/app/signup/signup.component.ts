import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../auth/authentication.service';
import { UserService } from '../user/user.service';
import { User } from '../models/user';
import { ProfileService } from './../profile/profile.service';


@Component({
  selector: 'alm-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  constructor(
    private router: Router,
    public profile: ProfileService
  ) { }

  ngOnInit() {
    // Skip this page if the profile is complete
    if (this.profile.checkProfileSufficient()) {
      this.router.navigate(['home']);
    }
  }

  save() {
    this.profile.initDefaults();
    this.profile.save();
    this.router.navigate(['/home']);
  }

}
