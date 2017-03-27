import { ActionsConfig } from '../config/actions-config';

/*
 * An empty state config containing:
 *
 */
export class EmptyStateConfig {
  icon?: string;
  title: string;
  info: string;
  helpLink?: {
    label: string;
    urlLabel?: string;
    url: string;
  }
}
