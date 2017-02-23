import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import {
  AuthenticationService,
  Broadcaster
} from 'ngx-login-client';

import { GlobalSettings } from './shared/globals';

@Component({
  host: {
    'class': 'app app-component flex-container in-column-direction flex-grow-1'
  },
  selector: 'alm-app',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [GlobalSettings]
})
export class AppComponent implements OnInit {

  notifications: Object[] = [];

  notificationType: Object = {
    'ok': 'alert-success',
    'info': 'alert-info',
    'warning': 'alert-warning',
    'error': 'alert-danger'
  };

  notificationTypeIcon: Object = {
    'ok': 'pficon-ok',
    'info': 'pficon-info',
    'warning': 'pficon-warning-triangle-o',
    'error': 'pficon-error-circle-o'
  };

  constructor(
    auth: AuthenticationService,
    private broadcaster: Broadcaster,
    private globalSettings: GlobalSettings
  ) {
    //auth.isLoggedIn();
  }

  ngOnInit() {
    this.broadcaster.on<any>('toastNotification')
      .subscribe((notificationData: any) => {
        this.notifications.splice(0, 0, {
          text: notificationData.notificationText,
          alertClass: this.notificationType[notificationData.notificationType],
          iconClass: this.notificationTypeIcon[notificationData.notificationType]
        });
        let interval = setInterval(() => {
          if (this.notifications.length) {
            this.notifications.splice(-1, 1);
          }
          else {
            clearInterval(interval);
          }
        }, 10000);
      });
  }
}
