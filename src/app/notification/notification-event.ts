import { Action } from '../config/action';
import { Notification } from './notification';

/*
 * A notification evet containing:
 *
 * action - Optional configuration settings for toolbar actions
 * data - A notification message
 */
export class NotificationEvent {
  action?: Action;
  data: Notification;
}
