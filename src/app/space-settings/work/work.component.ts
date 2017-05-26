import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'alm-work',
  templateUrl: 'work.component.html',
  styleUrls: ['./work.component.less']
})
export class WorkComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

}
