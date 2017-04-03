import { Action } from '../config/action';

/*
 * An empty state config containing:
 *
 * actionsConfig - Optional configuration settings for toolbar actions
 * icon - class for main icon. Ex. 'pficon pficon-add-circle-o'
 * info - Text for the main informational paragraph
 * title - Text for the main title
 *
 */
export class EmptyStateConfig {
  actions?: Action[];
  helpLink?: {
    label: string;
    urlLabel?: string;
    url: string;
  };
  icon?: string;
  info: string;
  title: string;
}
