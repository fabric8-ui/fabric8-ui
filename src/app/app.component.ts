/*
 * Angular 2 decorators and services
 */
import { Component, ViewEncapsulation } from '@angular/core';
import { cloneDeep } from 'lodash';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, Broadcaster } from 'ngx-login-client';
import { Notification, Notifications } from 'ngx-fabric8-wit';
import { NotificationService, Action } from 'ngx-widgets';

import { ControlComponent } from './control/control.component';
import { AboutService } from './shared/about.service';
import { NotificationsService } from './shared/notifications.service';

/*
 * App Component
 * Top Level Component
 */
@Component({
  host: {
    'class': 'app app-component flex-container in-column-direction flex-grow-1'
  },
  selector: 'f8-app',
  styleUrls: ['./app.component.scss'],
  templateUrl: './app.component.html'
})
export class AppComponent {


  constructor(
    private about: AboutService,
    private broadcaster: Broadcaster,
    private activatedRoute: ActivatedRoute,
    private authService: AuthenticationService,
    public notifications: NotificationsService
  ) {
  }

  ngOnInit() {
    console.log('Welcome to Fabric8!');
    console.log('This is', this.about.buildVersion, '(Build', '#' + this.about.buildNumber, 'and was built on', this.about.buildTimestamp, ')');
    this.activatedRoute.params.subscribe(() => {
      let query = window.location.search.substr(1);
      let result: any = {};
      query.split('&').forEach(function (part) {
        let item: any = part.split('=');
        result[item[0]] = decodeURIComponent(item[1]);
      });
      if (result['token_json']) {
        this.authService.logIn(result['token_json']);
      }
    });
  }

  handleAction($event: any): void {
    this.notifications.actionSubject.next($event.notification.action);
  }

}
