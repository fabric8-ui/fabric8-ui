import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'alm-forgot-password',
  templateUrl: 'forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  emailSent: boolean = false;

  constructor(
    private router: Router) {
  }

  ngOnInit() {
    
  }

  sendEmail() {
    this.emailSent = true;
  }

}
