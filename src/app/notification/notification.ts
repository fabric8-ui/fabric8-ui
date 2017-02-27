import { Action } from '../config/action';

/*
 * A notification message containing:
 *
 * header - The header to display for the notification (optional)
 * isPersistent - Flag to show close button for the notification even if showClose is false
 * message - The main text message of the notification
 * moreActions  Optional list of actions to place in the kebab menu
 * showClosed - Flag to show the close button on all notifications (not shown if the notification has menu actions)
 * type - The type of the notification message. Allowed value is one of these: 'success','info','danger', 'warning'
 */
export class Notification {
  header?: string;
  isPersistent?: boolean;
  message: string;
  moreActions?: Action[];
  primaryAction?: Action;
  showClose?: boolean;
  type: string;
}
