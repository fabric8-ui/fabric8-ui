import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'alm-alerts',
  templateUrl: 'alerts.component.html',
  styleUrls: ['./alerts.component.less']
})
export class AlertsComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {}

}
