import { Component, AfterViewChecked } from '@angular/core';
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
export class SignupComponent implements AfterViewChecked {

  constructor(
    private router: Router,
    public profile: ProfileService
  ) { }

  ngAfterViewChecked() {
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
