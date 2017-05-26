import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'alm-security',
  templateUrl: 'security.component.html',
  styleUrls: ['./security.component.less']
})
export class SecurityComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

}
