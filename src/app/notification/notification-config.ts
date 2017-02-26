import { ActionsConfig } from '../config/actions-config';

/*
 * A notification config containing:
 *
 * actionsConfig - Optional configuration settings for toolbar actions
 */
export class NotificationConfig {
  actionsConfig?: ActionsConfig;
  header: string;
  message: string;
  type: string;
  showClose?: boolean;
}
