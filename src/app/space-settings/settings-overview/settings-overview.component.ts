import { Component, OnInit } from '@angular/core';
import { Router }            from '@angular/router';


@Component({
  selector: 'alm-settingsOverview',
  templateUrl: 'settings-overview.component.html',
  styleUrls: ['./settings-overview.component.less']
})
export class SettingsOverviewComponent implements OnInit {

  constructor(
    private router: Router) {
  }

  ngOnInit() {

  }

}
