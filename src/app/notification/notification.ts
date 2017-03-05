import { Action } from '../config/action';

/*
 * A notification message containing:
 *
 * header - The header to display for the notification (optional)
 * isPersistent - Flag to show close button for the notification even if showClose is false
 * message - The main text message of the notification
 * moreActions  Optional list of actions to place in the kebab menu
 * showClosed - Flag to show the close button on all notifications (not shown with menu actions)
 * type - The type of the notification message; 'success','info','danger', 'warning'
 */
export class Notification {

  static readonly SUCCESS = 'success';
  static readonly INFO = 'info';
  static readonly DANGER = 'danger';
  static readonly WARNING = 'warning';

  header?: string;
  isPersistent?: boolean;
  message: string;
  moreActions?: Action[];
  primaryAction?: Action;
  showClose?: boolean;
  type: string;
}
