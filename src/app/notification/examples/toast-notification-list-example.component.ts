import {
  Component,
  OnInit,
  ViewEncapsulation
} from '@angular/core';

import { Router } from '@angular/router';

import { Action } from '../../config/action';
import { NotificationConfig } from "../notification-config";

@Component({
  encapsulation: ViewEncapsulation.None,
  host: {'class': 'app app-component flex-container in-column-direction flex-grow-1'},
  selector: 'toast-notification-list-example',
  styleUrls: ['./toast-notification-list-example.component.scss'],
  templateUrl: './toast-notification-list-example.component.html'
})
export class ToastNotificationListExampleComponent implements OnInit {

  constructor(private router: Router) {

  }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
  }

  // Action functions

}
